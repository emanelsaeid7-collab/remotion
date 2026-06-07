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

const VIDEO_TYPE_MAP = {
  fix: 'FixVideo', error: 'FixVideo', comparison: 'ComparisonVideo',
  workflow: 'WorkflowVideo', productivity: 'FixVideo',
  freelancing: 'FixVideo', automation: 'WorkflowVideo',
};

const FPS = 30;
const PORT = process.env.PORT || 3030;

app.post('/render', async (req, res) => {
  const videoData = req.body;
  const { videoType, sceneTimings, audio } = videoData;

  // ✅ تعريف كل المتغيرات أولاً
  const compositionId = VIDEO_TYPE_MAP[videoType] || 'FixVideo';
  const timestamp     = Date.now();
  const baseUrl       = process.env.BASE_URL || `http://localhost:${PORT}`;

  const silentVideo = path.join(OUTPUT_DIR, `silent_${timestamp}.mp4`);
  const audioFile   = path.join(OUTPUT_DIR, `audio_${timestamp}.mp3`);
  const finalVideo  = path.join(OUTPUT_DIR, `${videoType}_${timestamp}.mp4`);
  const propsFile   = path.join(OUTPUT_DIR, `props_${timestamp}.json`);

  // ── 1. Save audio ────────────────────────────────────────────────────────
  let hasAudio = false;
  if (audio?.base64 && audio.base64.length > 100) {
    try {
      fs.writeFileSync(audioFile, Buffer.from(audio.base64, 'base64'));
      const stats = fs.statSync(audioFile);
      hasAudio = true;
      console.log(`[audio] ✅ Saved — ${stats.size} bytes`);
    } catch (e) {
      console.error(`[audio] ❌`, e.message);
    }
  }

  // ── 2. Calculate duration from sceneTimings ──────────────────────────────
  let audioSec = 30;
  if (sceneTimings?.length > 0) {
    audioSec = sceneTimings[sceneTimings.length - 1].end;
  }
  const totalFrames = Math.ceil(audioSec * FPS);
  console.log(`[render] audio=${audioSec}s | frames=${totalFrames}`);

  // ── 3. Build props (no audio — Remotion renders silent) ──────────────────
  const finalVideoData = { ...videoData };
  delete finalVideoData.audio;
  delete finalVideoData.audioUrl;
  finalVideoData.totalDurationFrames = totalFrames;
  finalVideoData.hookDurFrames       = 0;
  finalVideoData.ctaDurFrames        = Math.ceil(5 * FPS);

  console.log('[props] keys:', Object.keys(finalVideoData));
  fs.writeFileSync(propsFile, JSON.stringify({ videoData: finalVideoData }));

  const chromePath = process.env.REMOTION_CHROME_EXECUTABLE || '/usr/bin/chromium';
  const entryPoint = path.join(__dirname, 'src', 'Root.jsx');

  try {
    // ── 4. Render silent video ────────────────────────────────────────────
    const renderCmd = [
      'npx remotion render',
      `"${entryPoint}"`,
      compositionId,
      `"${silentVideo}"`,
      `--props="${propsFile}"`,
      `--duration=${totalFrames}`,
      `--browser-executable="${chromePath}"`,
    ].join(' ');

    console.log(`[render] ▶ ${compositionId} — ${totalFrames} frames`);
    await execAsync(renderCmd, { cwd: __dirname, timeout: 10 * 60 * 1000 });
    fs.unlinkSync(propsFile);
    console.log(`[render] ✅ Silent video done`);

    // ── 5. Merge with FFmpeg ──────────────────────────────────────────────
    if (hasAudio) {
      console.log(`[ffmpeg] ▶ Merging...`);
      const ffmpegCmd = [
        'ffmpeg -y',
        `-i "${silentVideo}"`,
        `-i "${audioFile}"`,
        `-c:v copy`,
        `-c:a aac`,
        `-map 0:v:0`,
        `-map 1:a:0`,
        `"${finalVideo}"`,
      ].join(' ');

      await execAsync(ffmpegCmd, { timeout: 5 * 60 * 1000 });
      fs.unlinkSync(silentVideo);
      fs.unlinkSync(audioFile);
      console.log(`[ffmpeg] ✅ Merge done`);
    } else {
      fs.renameSync(silentVideo, finalVideo);
      console.log(`[render] ✅ No audio — video only`);
    }

    const videoUrl = `${baseUrl}/videos/${videoType}_${timestamp}.mp4`;
    console.log(`[done] ✅ ${videoUrl}`);
    res.json({ success: true, url: videoUrl, file: `${videoType}_${timestamp}.mp4`, videoType, durationSec: audioSec });

  } catch (err) {
    console.error(`[error] ❌`, err.message);
    [propsFile, silentVideo, audioFile].forEach(f => {
      try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch {}
    });
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok', version: '3.1' }));
app.get('/', (_, res) => res.json({ service: 'Remotion + FFmpeg', version: '3.1' }));

app.listen(PORT, () => {
  console.log(`🎬 Server → http://localhost:${PORT}`);
});
