import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: '50mb' })); // increased for base64 audio

const OUTPUT_DIR = path.join(__dirname, 'output');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
app.use('/videos', express.static(OUTPUT_DIR));
app.use('/audio',  express.static(OUTPUT_DIR));

const VIDEO_TYPE_MAP = {
  fix:          'FixVideo',
  error:        'FixVideo',
  comparison:   'ComparisonVideo',
  workflow:     'WorkflowVideo',
  productivity: 'FixVideo',
  freelancing:  'FixVideo',
  automation:   'WorkflowVideo',
};

// ── POST /render ──────────────────────────────────────────────────────────────
app.post('/render', async (req, res) => {
  const videoData = req.body;
  const { videoType } = videoData;

  const compositionId = VIDEO_TYPE_MAP[videoType] || 'FixVideo';
  const timestamp     = Date.now();
  const filename      = `${videoType}_${timestamp}.mp4`;
  const outputFile    = path.join(OUTPUT_DIR, filename);
  const propsFile     = path.join(OUTPUT_DIR, `props_${timestamp}.json`);

  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

  // ── Save base64 audio as MP3 file and replace with URL ──────────────────────
  let finalVideoData = { ...videoData };

  if (videoData.audio?.base64) {
    try {
      const audioFilename = `audio_${timestamp}.mp3`;
      const audioPath     = path.join(OUTPUT_DIR, audioFilename);
      const audioBuffer   = Buffer.from(videoData.audio.base64, 'base64');
      fs.writeFileSync(audioPath, audioBuffer);
      finalVideoData.audioUrl = `${baseUrl}/audio/${audioFilename}`;
      delete finalVideoData.audio; // remove base64 to keep props small
      console.log(`[audio] ✅ Saved: ${audioFilename}`);
    } catch (e) {
      console.error(`[audio] ❌ Failed to save audio:`, e.message);
    }
  }

  fs.writeFileSync(propsFile, JSON.stringify({ videoData: finalVideoData }));

  const chromePath = process.env.REMOTION_CHROME_EXECUTABLE || '/usr/bin/chromium';
  console.log(`[render] ▶ ${compositionId} — ${new Date().toISOString()}`);

  try {
    const cmd = [
      'npx remotion render',
      compositionId,
      `"${outputFile}"`,
      `--props="${propsFile}"`,
      `--browser-executable="${chromePath}"`,
    ].join(' ');

    await execAsync(cmd, { cwd: __dirname, timeout: 10 * 60 * 1000 });
    fs.unlinkSync(propsFile);

    const videoUrl = `${baseUrl}/videos/${filename}`;
    console.log(`[render] ✅ Done: ${videoUrl}`);
    res.json({ success: true, url: videoUrl, file: filename, videoType });

  } catch (err) {
    console.error(`[render] ❌ Error:`, err.message);
    if (fs.existsSync(propsFile)) fs.unlinkSync(propsFile);
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/', (_, res) => res.json({ service: 'Remotion Master Template', version: '2.0' }));

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`🎬 Remotion Server → http://localhost:${PORT}`);
  console.log(`🌍 Public URL: ${process.env.BASE_URL || '(set BASE_URL in Coolify)'}`);
});
