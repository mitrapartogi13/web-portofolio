import { useCallback, useRef } from 'react';

export function useSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClick = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      // Lazy initialization of AudioContext on user interaction
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const ctx = audioCtxRef.current;

      // Resume context if suspended (browser security policy)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      // Create nodes for click synthesis
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Configure oscillator for a light, high-frequency mechanical tick
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.03); // Fast sweep down

      // Volume envelope (extremely rapid decay)
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      // Connections
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Play and dispose
      osc.start(now);
      osc.stop(now + 0.04);
    } catch (error) {
      // Quiet fail if browser doesn't support Web Audio API
      console.warn("Web Audio API failed or blocked:", error);
    }
  }, []);

  return { playClick };
}
export default useSound;
