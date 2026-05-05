import type { VibeSettings } from "../types/game";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") {
    return null;
  }
  const AudioContextCtor = window.AudioContext ?? window.webkitAudioContext;
  if (!AudioContextCtor) {
    return null;
  }
  audioContext ??= new AudioContextCtor();
  return audioContext;
}

export function playBeep(
  settings: Pick<VibeSettings, "soundEnabled">,
  tone: "good" | "bad" | "click" | "win" = "click"
): void {
  if (!settings.soundEnabled) {
    return;
  }
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  const frequencies = {
    click: 440,
    good: 660,
    bad: 180,
    win: 880
  };

  oscillator.frequency.setValueAtTime(frequencies[tone], now);
  oscillator.type = tone === "bad" ? "sawtooth" : "triangle";
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.05, now + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (tone === "win" ? 0.22 : 0.1));
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + (tone === "win" ? 0.24 : 0.12));
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

