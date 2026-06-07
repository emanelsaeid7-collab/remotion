import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: '50mb' }));

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

const FPS            = 30;
const HOOK_SEC       = 5;
const CTA_SEC        = 5;

app.post('/render', async (req, res) => {
  const videoData     = req.body;
  const { videoType, sceneTimings, audio } = videoData;

  const compositionId = VIDEO_TYPE_MAP[videoType] || 'FixVideo';
  const timestamp     = Date.now();
  const filename      = `${videoType}_${timestamp}.mp4`;
  const outputFile    = path.join(OUTPUT_DIR, filename);
  const propsFile     = path.join(OUTPUT_DIR, `props_${timestamp}.json`);
  const baseUrl       = process.env.BASE_URL || `http://localhost:${PORT}`;

  let finalVideoData  = { ...videoData };

  // ── Save audio ────────────────────────────────────────────────────────────
  if (audio?.base64 && audio.base64.length > 100) {
    try {
      const audioFilename = `audio_${timestamp}.mp3`;
      fs.writeFileSync(path.join(OUTPUT_DIR, audioFilename), Buffer.from(audio.base64, 'base64'));
      finalVideoData.audioUrl = `${baseUrl}/audio/${audioFilename}`;
      console.log(`[audio] ✅ ${audioFilename}`);
    } catch (e) {
      console.error(`[audio] ❌`, e.message);
    }
  }
  delete finalVideoData.audio;

  // ── Calculate total duration ──────────────────────────────────────────────
  let audioSec = 30; // default
  if (sceneTimings?.length > 0) {
    audioSec = sceneTimings[sceneTimings.length - 1].end;
  }
  const totalSec    = HOOK_SEC + audioSec + CTA_SEC;
  const totalFrames = Math.ceil(totalSec * FPS);

  // pass durations into props so MasterTemplate can use them
  finalVideoData.totalDurationFrames = totalFrames;
  finalVideoData.hookDurFrames       = HOOK_SEC * FPS;
  finalVideoData.ctaDurFrames        = CTA_SEC * FPS;

  console.log(`[render] audio=${audioSec}s | total=${totalSec}s | frames=${totalFrames}`);

  fs.writeFileSync(propsFile, JSON.stringify({ videoData: finalVideoData }));

  const chromePath = process.env.REMOTION_CHROME_EXECUTABLE || '/usr/bin/chromium';
  const entryPoint = path.join(__dirname, 'src', 'Root.jsx');

  try {
    // ✅ استخدام --duration بدلاً من --frames
    const cmd = [
      'npx remotion render',
      `"${entryPoint}"`,
      compositionId,
      `"${outputFile}"`,
      `--props="${propsFile}"`,
      `--duration=${totalFrames}`,
      `--browser-executable="${chromePath}"`,
    ].join(' ');

    console.log(`[render] CMD: ${cmd}`);
    await execAsync(cmd, { cwd: __dirname, timeout: 10 * 60 * 1000 });
    fs.unlinkSync(propsFile);

    const videoUrl = `${baseUrl}/videos/${filename}`;
    console.log(`[render] ✅ ${videoUrl}`);
    res.json({ success: true, url: videoUrl, file: filename, videoType, durationSec: totalSec });

  } catch (err) {
    console.error(`[render] ❌`, err.message);
    if (fs.existsSync(propsFile)) fs.unlinkSync(propsFile);
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.get('/', (_, res) => res.json({ service: 'Remotion Master Template', version: '2.3' }));

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`🎬 Remotion Server → http://localhost:${PORT}`);
  console.log(`🌍 Public URL: ${process.env.BASE_URL || '(set BASE_URL in Coolify)'}`);
});
