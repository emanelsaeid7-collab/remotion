import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';
import { spawn } from 'child_process';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(express.json({ limit: '50mb' }));

const OUTPUT_DIR = path.join(__dirname, 'output');
const ASSETS_DIR = path.join(__dirname, 'assets');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.mkdirSync(ASSETS_DIR, { recursive: true });
app.use('/videos', express.static(OUTPUT_DIR));

const VIDEO_TYPE_MAP = {
  fix: 'FixVideo', error: 'FixVideo', comparison: 'ComparisonVideo',
  workflow: 'WorkflowVideo', productivity: 'FixVideo',
  freelancing: 'FixVideo', automation: 'WorkflowVideo',
};

const FPS = 30;
const PORT = process.env.PORT || 3030;

const BG_MUSIC_FILES = [
  path.join(ASSETS_DIR, 'bg-music-1.mp3'),
  path.join(ASSETS_DIR, 'bg-music-2.mp3'),
  path.join(ASSETS_DIR, 'bg-music-3.mp3'),
];

// ✅ Venv Python path (installed during Docker build)
const VENV_PYTHON = '/opt/venv/bin/python3';

// ── Verify Kokoro at startup ──────────────────────────────────────────────
async function verifyKokoro() {
  try {
    await execAsync(`${VENV_PYTHON} -c "from kokoro import KPipeline; print('OK')"`);
    console.log('[startup] ✅ Kokoro TTS is ready');
    return true;
  } catch (e) {
    console.error('[startup] ❌ Kokoro not available:', e.message);
    return false;
  }
}

// ── Helper: Download file ──────────────────────────────────────────────────
async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const file = fs.createWriteStream(destPath);
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(destPath); });
    }).on('error', reject);
  });
}

// ── Helper: Ensure logo ────────────────────────────────────────────────────
async function ensureLogo() {
  const logoPath = path.join(ASSETS_DIR, 'logo.webp');
  if (!fs.existsSync(logoPath)) {
    try {
      await downloadFile('https://smartremotegigs.com/wp-content/uploads/2026/06/Favicon3.webp', logoPath);
    } catch (e) { return null; }
  }
  return logoPath;
}

async function getLogoBase64() {
  const logoPath = await ensureLogo();
  if (!logoPath) return null;
  try {
    const buffer = fs.readFileSync(logoPath);
    return `data:image/webp;base64,${buffer.toString('base64')}`;
  } catch (e) { return null; }
}

// ── Helper: Audio duration ──────────────────────────────────────────────────
async function getAudioDuration(filePath) {
  try {
    const { stdout } = await execAsync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
    );
    const d = parseFloat(stdout.trim());
    return isNaN(d) ? 0 : d;
  } catch (e) { return 0; }
}

// ── Helper: Generate speech with Kokoro TTS ────────────────────────────────
async function generateKokoroSpeech(text, voiceId, outputPath) {
  const tempTextFile = path.join(OUTPUT_DIR, `kokoro_text_${Date.now()}.txt`);
  fs.writeFileSync(tempTextFile, text, 'utf-8');

  const scriptPath = path.join(__dirname, 'kokoro_tts.py');

  return new Promise((resolve, reject) => {
    const python = spawn(VENV_PYTHON, [scriptPath], {
      env: {
        ...process.env,
        KOKORO_TEXT_FILE: tempTextFile,
        KOKORO_VOICE: voiceId,
        KOKORO_OUTPUT: outputPath,
      }
    });

    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => { stdout += data.toString(); });
    python.stderr.on('data', (data) => { stderr += data.toString(); console.log('[kokoro]', data.toString().trim()); });

    python.on('close', (code) => {
      try { if (fs.existsSync(tempTextFile)) fs.unlinkSync(tempTextFile); } catch {}

      if (code === 0 && stdout.includes('KOKORO_SUCCESS')) {
        resolve();
      } else {
        reject(new Error(`Kokoro failed (code ${code}): ${stderr || stdout}`));
      }
    });
  });
}

// ── Helper: Merge voice + background music ─────────────────────────────────
async function mergeWithBackgroundMusic(voicePath, musicPath, outputPath, targetDuration) {
  const ffmpegCmd = [
    'ffmpeg -y',
    `-i "${voicePath}"`,
    `-i "${musicPath}"`,
    `-filter_complex "`,
    `[1:a]afade=t=out:st=${Math.max(targetDuration - 3, 0)}:d=3,volume=0.08[music];`,
    `[0:a][music]amix=inputs=2:duration=first:dropout_transition=3[a]"`,
    `-map "[a]"`,
    `-c:a aac -b:a 192k`,
    `"${outputPath}"`,
  ].join(' ');

  await execAsync(ffmpegCmd, { timeout: 60 * 1000 });
}

function getRandomBackgroundMusic() {
  const available = BG_MUSIC_FILES.filter(f => fs.existsSync(f));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

app.post('/render', async (req, res) => {
  const videoData = req.body;
  const { videoType, sceneTimings, voice_id, fullNarration, music } = videoData;

  const compositionId = VIDEO_TYPE_MAP[videoType] || 'FixVideo';
  const timestamp = Date.now();
  const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;

  const silentVideo = path.join(OUTPUT_DIR, `silent_${timestamp}.mp4`);
  const voiceFile = path.join(OUTPUT_DIR, `voice_${timestamp}.wav`);
  const finalAudio = path.join(OUTPUT_DIR, `audio_${timestamp}.mp3`);
  const finalVideo = path.join(OUTPUT_DIR, `${videoType}_${timestamp}.mp4`);
  const propsFile = path.join(OUTPUT_DIR, `props_${timestamp}.json`);

  const logoBase64 = await getLogoBase64();

  // ── 1. Generate voice with Kokoro TTS ──────────────────────────────────
  let hasAudio = false;
  let audioDurationSec = 0;
  const selectedVoice = voice_id || 'af_heart';
  const narrationText = fullNarration || videoData.title || 'Hello';

  console.log('=== KOKORO TTS ===');
  console.log('Voice:', selectedVoice);
  console.log('Text length:', narrationText.length);
  console.log('Text preview:', narrationText.substring(0, 100));

  try {
    await generateKokoroSpeech(narrationText, selectedVoice, voiceFile);
    const voiceStats = fs.statSync(voiceFile);
    console.log(`[kokoro] ✅ Generated — ${voiceStats.size} bytes`);

    audioDurationSec = await getAudioDuration(voiceFile);
    console.log(`[kokoro] ⏱️  Duration: ${audioDurationSec}s`);
    hasAudio = true;
  } catch (e) {
    console.error(`[kokoro] ❌ TTS failed:`, e.message);
    hasAudio = false;
  }

  // ── 2. Add background music ────────────────────────────────────────────
  if (hasAudio && (music !== false)) {
    const bgMusic = getRandomBackgroundMusic();
    if (bgMusic) {
      console.log(`[music] 🎵 Adding background: ${path.basename(bgMusic)}`);
      try {
        await mergeWithBackgroundMusic(voiceFile, bgMusic, finalAudio, audioDurationSec);
        fs.unlinkSync(voiceFile);
        console.log(`[music] ✅ Mixed with background music`);
      } catch (e) {
        console.error(`[music] ❌ Mix failed, using voice only:`, e.message);
        fs.renameSync(voiceFile, finalAudio);
      }
    } else {
      console.log(`[music] ⚠️  No background music found`);
      fs.renameSync(voiceFile, finalAudio);
    }
  } else if (hasAudio) {
    fs.renameSync(voiceFile, finalAudio);
  }

  // ── 3. Adjust sceneTimings ─────────────────────────────────────────────
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

  const totalFrames = Math.ceil(audioSec * FPS);
  console.log(`[render] audio=${audioSec}s | frames=${totalFrames}`);

  // ── 4. Build props ─────────────────────────────────────────────────────
  const finalVideoData = { ...videoData };
  delete finalVideoData.audio;
  delete finalVideoData.audioUrl;
  delete finalVideoData.fullNarration;

  finalVideoData.sceneTimings = adjustedTimings;
  finalVideoData.audioDuration = audioDurationSec;
  finalVideoData.totalDurationFrames = totalFrames;
  finalVideoData.ctaDurFrames = Math.ceil(5 * FPS);
  finalVideoData.logoBase64 = logoBase64;
  finalVideoData.voiceId = selectedVoice;

  fs.writeFileSync(propsFile, JSON.stringify({ videoData: finalVideoData }, null, 2));

  const chromePath = process.env.REMOTION_CHROME_EXECUTABLE || '/usr/bin/chromium';
  const entryPoint = path.join(__dirname, 'src', 'Root.jsx');

  try {
    // ── 5. Render silent video ─────────────────────────────────────────
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

    // ── 6. Merge with FFmpeg ───────────────────────────────────────────
    if (hasAudio) {
      console.log(`[ffmpeg] ▶ Merging...`);
      const ffmpegCmd = [
        'ffmpeg -y',
        `-i "${silentVideo}"`,
        `-i "${finalAudio}"`,
        `-c:v copy`,
        `-c:a aac`,
        `-b:a 192k`,
        `-map 0:v:0`,
        `-map 1:a:0`,
        `-shortest`,
        `"${finalVideo}"`,
      ].join(' ');

      await execAsync(ffmpegCmd, { timeout: 5 * 60 * 1000 });
      fs.unlinkSync(silentVideo);
      fs.unlinkSync(finalAudio);
      console.log(`[ffmpeg] ✅ Merge done`);
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
      audioDuration: audioDurationSec,
      hasAudio,
      voice: selectedVoice,
    });

  } catch (err) {
    console.error(`[error] ❌`, err.message);
    [propsFile, silentVideo, voiceFile, finalAudio].forEach(f => {
      try { if (fs.existsSync(f)) fs.unlinkSync(f); } catch {}
    });
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (_, res) => res.json({ status: 'ok', version: '6.6' }));
app.get('/', (_, res) => res.json({ service: 'SmartRemoteGigs Video + Kokoro TTS', version: '6.6' }));

// ── Start server ────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`🎬 SmartRemoteGigs Video Server → http://localhost:${PORT}`);
  await verifyKokoro();
});
