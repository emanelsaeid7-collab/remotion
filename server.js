import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

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

async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(destPath); });
    }).on('error', reject);
  });
}

async function ensureLogo() {
  const logoDir = path.join(__dirname, 'assets');
  const logoPath = path.join(logoDir, 'logo.webp');
  fs.mkdirSync(logoDir, { recursive: true });
  if (!fs.existsSync(logoPath)) {
    console.log('[assets] 🖼️  Downloading logo...');
    try {
      await downloadFile('https://smartremotegigs.com/wp-content/uploads/2026/06/Favicon3.webp', logoPath);
      console.log('[assets] ✅ Logo downloaded');
    } catch (e) {
      console.error('[assets] ❌', e.message);
      return null;
    }
  }
  return logoPath;
}

async function getLogoBase64() {
  const logoPath = await ensureLogo();
  if (!logoPath) return null;
  try {
    const buffer = fs.readFileSync(logoPath);
    return `data:image/webp;base64,${buffer.toString('base64')}`;
  } catch (e) {
    console.error('[assets] ❌', e.message);
    return null;
  }
}

async function getAudioDuration(filePath) {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );
    const duration = parseFloat(stdout.trim());
    return isNaN(duration) ? 0 : duration;
  } catch (e) {
    console.error(`[ffprobe] ❌`, e.message);
    return 0;
  }
}

app.post('/render', async (req, res) => {
  const videoData = req.body;
  const { videoType, sceneTimings, audio, voice_id } = videoData;

  const compositionId = VIDEO_TYPE_MAP[videoType] || 'FixVideo';
  const timestamp     = Date.now();
  const baseUrl       = process.env.BASE_URL || `http://localhost:${PORT}`;

  const silentVideo = path.join(OUTPUT_DIR, `silent_${timestamp}.mp4`);
  const audioFile   = path.join(OUTPUT_DIR, `audio_${timestamp}.mp3`);
  const finalVideo  = path.join(OUTPUT_DIR, `${videoType}_${timestamp}.mp4`);
  const propsFile   = path.join(OUTPUT_DIR, `props_${timestamp}.json`);

  const logoBase64 = await getLogoBase64();

  // ── 1. Save audio ─────────────────────────────────────────────────────────
  let hasAudio = false;
  let audioDurationSec = 0;

  console.log('=== AUDIO RECEIVED ===');
  console.log('audio?.base64 exists:', !!audio?.base64);
  console.log('audio?.base64 length:', audio?.base64?.length || 0);
  console.log('audio?.base64 first 50:', audio?.base64?.substring(0, 50) || 'EMPTY');

  if (audio?.base64 && audio.base64.length > 100) {
    try {
      const audioBuffer = Buffer.from(audio.base64, 'base64');
      console.log('audioBuffer size:', audioBuffer.length, 'bytes');

      fs.writeFileSync(audioFile, audioBuffer);
      const stats = fs.statSync(audioFile);
      hasAudio = true;
      console.log(`[audio] ✅ Saved MP3 — ${stats.size} bytes`);

      audioDurationSec = await getAudioDuration(audioFile);
      console.log(`[audio] ⏱️  Duration: ${audioDurationSec}s`);
    } catch (e) {
      console.error(`[audio] ❌ Error:`, e.message);
      hasAudio = false;
    }
  } else {
    console.log(`[audio] ⚠️  No valid audio base64`);
  }

  // ── 2. Adjust sceneTimings ────────────────────────────────────────────────
  let adjustedTimings = sceneTimings || [];
  let audioSec = 30;

  if (adjustedTimings.length > 0) {
    const lastTiming = adjustedTimings[adjustedTimings.length - 1];
    const theoreticalEnd = lastTiming.end;

    if (audioDurationSec > 0 && Math.abs(audioDurationSec - theoreticalEnd) > 0.5) {
      const scaleFactor = audioDurationSec / theoreticalEnd;
      console.log(`[timings] 🔄 Scaling by ${scaleFactor.toFixed(3)}`);
      adjustedTimings = adjustedTimings.map(t => ({
        ...t,
        start: parseFloat((t.start * scaleFactor).toFixed(3)),
        end: parseFloat((t.end * scaleFactor).toFixed(3)),
      }));
    }
    audioSec = adjustedTimings[adjustedTimings.length - 1].end;
  } else if (audioDurationSec > 0) {
    audioSec = audioDurationSec;
  }

  // ── 3. Calculate total duration (scenes + hook + CTA) ────────────────────
  const hookFrames = Math.ceil(2 * FPS);   // 2s intro
  const ctaFrames = Math.ceil(5 * FPS);    // 5s CTA
  const scenesDurationFrames = Math.ceil(audioSec * FPS);
  const totalFrames = scenesDurationFrames + hookFrames + ctaFrames;

  console.log(`[duration] scenes=${scenesDurationFrames} + hook=${hookFrames} + cta=${ctaFrames} = ${totalFrames}`);

  // ── 4. Build props ────────────────────────────────────────────────────────
  const finalVideoData = { ...videoData };
  delete finalVideoData.audio;
  delete finalVideoData.audioUrl;

  finalVideoData.sceneTimings = adjustedTimings;
  finalVideoData.audioDuration = audioDurationSec;
  finalVideoData.totalDurationFrames = totalFrames;
  finalVideoData.hookDurFrames = hookFrames;
  finalVideoData.ctaDurFrames = ctaFrames;
  finalVideoData.logoBase64 = logoBase64;
  finalVideoData.voiceId = voice_id || 'cgSgspJ2msm6clMCkdW9';

  fs.writeFileSync(propsFile, JSON.stringify({ videoData: finalVideoData }, null, 2));

  const chromePath = process.env.REMOTION_CHROME_EXECUTABLE || '/usr/bin/chromium';
  const entryPoint = path.join(__dirname, 'src', 'Root.jsx');

  try {
    // ── 5. Render silent video ────────────────────────────────────────────
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

    // ── 6. Merge with FFmpeg ──────────────────────────────────────────────
    if (hasAudio) {
      console.log(`[ffmpeg] ▶ Merging audio + video...`);
      console.log(`[ffmpeg] video: ${silentVideo} (${fs.statSync(silentVideo).size} bytes)`);
      console.log(`[ffmpeg] audio: ${audioFile} (${fs.statSync(audioFile).size} bytes)`);

      // ✅ NO -shortest — let video run full duration, audio plays naturally
      const ffmpegCmd = [
        'ffmpeg -y',
        `-i "${silentVideo}"`,
        `-i "${audioFile}"`,
        `-c:v copy`,
        `-c:a aac`,
        `-b:a 192k`,
        `-map 0:v:0`,
        `-map 1:a:0`,
        `-af "volume=1.0"`,
        `"${finalVideo}"`,
      ].join(' ');

      console.log(`[ffmpeg] cmd: ${ffmpegCmd.substring(0, 200)}...`);

      const { stdout, stderr } = await execAsync(ffmpegCmd, { timeout: 5 * 60 * 1000 });
      if (stderr) console.log('[ffmpeg] log:', stderr.substring(0, 300));

      fs.unlinkSync(silentVideo);
      fs.unlinkSync(audioFile);

      const finalStats = fs.statSync(finalVideo);
      console.log(`[ffmpeg] ✅ Final video: ${finalStats.size} bytes`);
    } else {
      console.log(`[render] ⚠️  No audio — video only`);
      fs.renameSync(silentVideo, finalVideo);
    }

    const videoUrl = `${baseUrl}/videos/${videoType}_${timestamp}.mp4`;
    console.log(`[done] ✅ ${videoUrl}`);
    res.json({ 
      success: true, 
      url: videoUrl, 
      file: `${videoType}_${timestamp}.mp4`, 
      videoType, 
      durationSec: audioSec,
      totalFrames,
      hasAudio,
      audioDuration: audioDurationSec,
    });

  } catch (err) {
    console.error(`[error] ❌`, err.message);
    [propsFile, silentVideo, audioFile].forEach(f => {
      try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch {}
    });
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok', version: '3.7' }));
app.get('/', (_, res) => res.json({ service: 'Remotion + FFmpeg + SmartRemoteGigs', version: '3.7' }));

app.listen(PORT, () => {
  console.log(`🎬 SmartRemoteGigs Video Server → http://localhost:${PORT}`);
});
