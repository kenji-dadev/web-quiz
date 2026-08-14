"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

function getSpeechSupport() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function useSpeak() {
  const isSupported = useSyncExternalStore(
    () => () => {},
    getSpeechSupport,
    () => false
  );
  const [speakingText, setSpeakingText] = useState<string | null>(null);

  const speak = useCallback((text: string, lang = "en-US") => {
    if (!getSpeechSupport()) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setSpeakingText(text);
    utterance.onend = () => setSpeakingText(null);
    utterance.onerror = () => setSpeakingText(null);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (!getSpeechSupport()) {
      return;
    }
    window.speechSynthesis.cancel();
    setSpeakingText(null);
  }, []);

  return { speak, stop, isSupported, speakingText };
}
