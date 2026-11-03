import asyncio
import os
import sys

from google import genai
from google.genai import types

TARGET_SECONDS = 56.0
OUT_RAW = "assets/bgm/track_raw.pcm"


async def main():
    api_key = os.environ["GEMINI_API_KEY"]
    client = genai.Client(api_key=api_key, http_options={"api_version": "v1alpha"})

    models_to_try = [
        "models/lyria-realtime-exp",
    ]

    for model in models_to_try:
        try:
            await run_session(client, model)
            print("OK:", model)
            return
        except Exception as e:
            print("FAILED:", model, repr(e), file=sys.stderr)
    print("ALL_LYRIA_FAILED")
    sys.exit(1)


async def run_session(client, model):
    collected = bytearray()
    mime_seen = None
    bytes_per_second = 48000 * 2 * 2  # assume 48kHz, 16-bit, stereo until confirmed

    async with client.aio.live.music.connect(model=model) as session:
        await session.set_weighted_prompts(
            prompts=[
                types.WeightedPrompt(
                    text="modern business news underscore, digital, fast-paced, minimal, professional, instrumental, stock market tension, orchestral hits, no vocals",
                    weight=1.0,
                ),
                types.WeightedPrompt(
                    text="vocals, lyrics, singing, choir, rap, spoken word, humming",
                    weight=-1.0,
                ),
            ]
        )
        await session.set_music_generation_config(
            config=types.LiveMusicGenerationConfig(
                bpm=104,
                density=0.62,
                brightness=0.5,
                guidance=4.0,
                temperature=1.1,
            )
        )
        await session.play()

        async for message in session.receive():
            if message.server_content and message.server_content.audio_chunks:
                for chunk in message.server_content.audio_chunks:
                    if chunk.data:
                        collected.extend(chunk.data)
                        if mime_seen is None and chunk.mime_type:
                            mime_seen = chunk.mime_type
                            print("mime_type:", mime_seen, file=sys.stderr)
            have_seconds = len(collected) / bytes_per_second
            if have_seconds >= TARGET_SECONDS:
                break

        await session.stop()
        await session.close()

    os.makedirs(os.path.dirname(OUT_RAW), exist_ok=True)
    with open(OUT_RAW, "wb") as f:
        f.write(collected)
    print("wrote", OUT_RAW, len(collected), "bytes", "~", len(collected) / bytes_per_second, "seconds")
    with open("assets/bgm/track_mime.txt", "w") as f:
        f.write(mime_seen or "unknown")


if __name__ == "__main__":
    asyncio.run(main())
