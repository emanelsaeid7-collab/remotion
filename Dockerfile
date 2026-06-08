FROM node:20-slim

RUN apt-get update && apt-get install -y \
    chromium \
    ffmpeg \
    fonts-noto \
    fonts-noto-cjk \
    ca-certificates \
    python3 \
    python3-pip \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# ✅ Simplest: Install Kokoro directly to system Python (safe in Docker)
RUN python3 -m pip install --break-system-packages kokoro-onnx soundfile

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV REMOTION_CHROME_EXECUTABLE=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

RUN mkdir -p output assets

EXPOSE 3030

CMD ["node", "server.js"]
