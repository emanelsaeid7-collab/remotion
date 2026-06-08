#!/usr/bin/env python3
import sys
import os
import soundfile as sf

try:
    from kokoro import KPipeline

    text_file = os.environ.get("KOKORO_TEXT_FILE")
    voice = os.environ.get("KOKORO_VOICE", "af_heart")
    output = os.environ.get("KOKORO_OUTPUT")

    with open(text_file, "r", encoding="utf-8") as f:
        text = f.read()

    pipeline = KPipeline(lang_code="a")
    generator = pipeline(text, voice=voice, speed=1.0)

    for i, (gs, ps, audio) in enumerate(generator):
        sf.write(output, audio, 24000)
        break

    print("KOKORO_SUCCESS")
    sys.exit(0)
except Exception as e:
    print(f"KOKORO_ERROR: {e}", file=sys.stderr)
    sys.exit(1)
