FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    ffmpeg \
    fonts-noto \
    fonts-noto-cjk \
    ca-certificates \
    python3 \
    python3-pip \
    python3-venv \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Install Kokoro TTS
RUN pip3 install --break-system-packages kokoro-onnx soundfile

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV REMOTION_CHROME_EXECUTABLE=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p output assets

# Download default background music (optional - can be replaced)
RUN curl -L -o /app/assets/bg-music-1.mp3 "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3" || true
RUN curl -L -o /app/assets/bg-music-2.mp3 "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Algorithms.mp3" || true
RUN curl -L -o /app/assets/bg-music-3.mp3 "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Komiku/Its_time_for_adventure/Komiku_-_03_-_Battle_of_Pogs.mp3" || true

EXPOSE 3030

CMD ["node", "server.js"]
