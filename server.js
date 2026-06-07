import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 3030;

// Serve rendered videos as static files
const OUTPUT_DIR = path.join(__dirname, 'output');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
app.use('/videos', express.static(OUTPUT_DIR));

// 1. تعريف جميع الأنواع السبعة هنا
const VIDEO_TYPE_MAP = {
  fix:          'FixVideo',
  error:        'ErrorVideo',
  comparison:   'ComparisonVideo',
  workflow:     'WorkflowVideo',
  productivity: 'ProductivityVideo',
  freelancing:  'FreelancingVideo',
  automation:   'AutomationVideo',
};

// ── POST /render ─────────────────────────────────────────────────────────────
app.post('/render', async (req, res) => {
  const videoData = req.body || {};
  const { videoType } = videoData;

  // 2. التحقق من صحة النوع
  if (!VIDEO_TYPE_MAP[videoType]) {
    return res.status(400).json({
      error: `Invalid videoType. Available types: ${Object.keys(VIDEO_TYPE_MAP).join(' | ')}`,
    });
  }

  const compositionId = VIDEO_TYPE_MAP[videoType];
  const timestamp     = Date.now();
  const filename      = `${compositionId}_${timestamp}.mp4`;
  const outputFile    = path.join(OUTPUT_DIR, filename);
  const propsFile     = path.join(OUTPUT_DIR, `props_${timestamp}.json`);

  fs.writeFileSync(propsFile, JSON.stringify({ videoData }));

  const chromePath = process.env.REMOTION_CHROME_EXECUTABLE || '/usr/bin/chromium';

  console.log(`[render] ▶ ${compositionId} — ${new Date().toISOString()}`);

  try {
    const cmd = [
      'npx remotion render',
      'src/index.jsx',           // <--- نقطة البداية الصحيحة
      compositionId,
      `"${outputFile}"`,
      `--props="${propsFile}"`,
      `--browser-executable="${chromePath}"`,
      '--log=verbose',
    ].join(' ');

    await execAsync(cmd, { cwd: __dirname, timeout: 10 * 60 * 1000 });

    fs.unlinkSync(propsFile);

    const baseUrl  = process.env.BASE_URL || `http://localhost:${PORT}`;
    const videoUrl = `${baseUrl}/videos/${filename}`;

    console.log(`[render] ✅ Done: ${videoUrl}`);
    res.json({ success: true, url: videoUrl, file: filename, videoType });

  } catch (err) {
    console.error(`[render] ❌ Error:`, err.message);
    if (fs.existsSync(propsFile)) fs.unlinkSync(propsFile);
    res.status(500).json({ error: err.message });
  }
});

// ── GET /health ──────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── GET / ────────────────────────────────────────────────────────────────────
app.get('/', (_, res) => res.json({
  service: 'Remotion Master Template',
  endpoints: {
    render: 'POST /render',
    health: 'GET  /health',
    videos: 'GET  /videos/:filename',
  },
}));

app.listen(PORT, () => {
  console.log(`🎬 Remotion Render Server → http://localhost:${PORT}`);
  console.log(`🌍 Public URL: ${process.env.BASE_URL || '(set BASE_URL env var in Coolify)'}`);
});
