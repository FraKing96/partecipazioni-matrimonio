"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/music.mp3";
const START_TIME = 105; // 1:45

function waitForEvent(
  audio: HTMLAudioElement,
  event: keyof HTMLMediaElementEventMap,
): Promise<void> {
  return new Promise((resolve) => {
    if (event === "loadedmetadata" && audio.readyState >= 1) {
      resolve();
      return;
    }
    audio.addEventListener(event, () => resolve(), { once: true });
  });
}

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const preparedRef = useRef(false);
  const [playing, setPlaying] = useState(false);

  const prepareAudio = useCallback(async (audio: HTMLAudioElement) => {
    if (preparedRef.current) return;

    if (audio.readyState < 1) {
      await waitForEvent(audio, "loadedmetadata");
    }

    audio.currentTime = START_TIME;
    await Promise.race([
      waitForEvent(audio, "seeked"),
      new Promise<void>((resolve) => setTimeout(resolve, 200)),
    ]);
    preparedRef.current = true;
  }, []);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return false;

    try {
      await prepareAudio(audio);
      await audio.play();
      setPlaying(true);
      return true;
    } catch {
      setPlaying(false);
      return false;
    }
  }, [prepareAudio]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.45;

    tryPlay();

    let unlockRemoved = false;
    const removeUnlockListeners = () => {
      if (unlockRemoved) return;
      unlockRemoved = true;
      window.removeEventListener("click", unlockAutoplay);
      window.removeEventListener("touchstart", unlockAutoplay);
      window.removeEventListener("keydown", unlockAutoplay);
    };

    // Solo per sbloccare l'autoplay al primo tap — non riavvia dopo pausa
    const unlockAutoplay = () => {
      if (audio.paused) {
        tryPlay();
      }
    };

    window.addEventListener("click", unlockAutoplay, { once: true });
    window.addEventListener("touchstart", unlockAutoplay, { once: true });
    window.addEventListener("keydown", unlockAutoplay, { once: true });

    const onPlay = () => {
      setPlaying(true);
      removeUnlockListeners();
    };
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      audio.currentTime = START_TIME;
      audio.play().catch(() => setPlaying(false));
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      removeUnlockListeners();
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [tryPlay]);

  async function toggle(e: React.MouseEvent) {
    e.stopPropagation();

    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
    } else {
      await tryPlay();
    }
  }

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Metti in pausa la musica" : "Riproduci la musica"}
        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-cream/90 text-charcoal shadow-sm backdrop-blur-sm transition-colors hover:border-gold/50 hover:bg-white"
      >
        {playing ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden
          >
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5"
            aria-hidden
          >
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        )}
      </button>
    </>
  );
}
