declare global {
  interface Window {
    YT: { Player: any };
    onYouTubeIframeAPIReady: () => void;
  }
}

type StateOptions = 'Unstarted' | 'Ended' | 'Playing' | 'Paused' | 'Buffering' | 'Cued';

// ─── Hook params (things that configure/drive the player) ────────────────────
type UseYTPlayerParams = {
  anchorRef: React.RefObject<HTMLDivElement | null>; // ref to the mounting div
  videoId: string;
  isPlaying?: boolean;
  isLoop?: boolean;
  // listeners
  onReady?: (e: any) => void;
  onStateChange?: (state: StateOptions) => void;
  onProgress?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
};

// ─── Hook return (actions exposed to the parent) ─────────────────────────────
type UseYTPlayerReturn = {
  play: () => void;
  pause: () => void;
  stop: () => void;
  seekTo: (seconds: number) => void;
  setLoop: (loop: boolean) => void;
  setVolume: (volume: number) => void; // 0–100
  mute: () => void;
  unmute: () => void;
  getDuration: () => number;
  getCurrentTime: () => number;
  isReady: boolean;
};

import { useCallback, useEffect, useRef, useState } from 'react';

const STATE_MAP: Record<number, StateOptions> = {
  [-1]: 'Unstarted',
  [0]: 'Ended',
  [1]: 'Playing',
  [2]: 'Paused',
  [3]: 'Buffering',
  [5]: 'Cued',
};

// ─── Inject the YT iframe script once across the app lifetime ─────────────────
let ytApiPromise: Promise<void> | null = null;

const loadYTApi = (): Promise<void> => {
  if (ytApiPromise) return ytApiPromise;

  ytApiPromise = new Promise((resolve) => {
    if (window.YT?.Player) {
      resolve();
      return;
    }
    window.onYouTubeIframeAPIReady = resolve;
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
    }
  });

  return ytApiPromise;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
const useYTPlayer = ({
  anchorRef,
  videoId,
  isPlaying = false,
  isLoop = false,
  onReady,
  onStateChange,
  onProgress,
  onEnded,
}: UseYTPlayerParams): UseYTPlayerReturn => {
  const playerRef = useRef<any>(null);
  const progressTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isReady, setIsReady] = useState(false);

  // Keep latest callbacks in refs so player events never go stale
  const onReadyRef = useRef(onReady);
  const onStateChangeRef = useRef(onStateChange);
  const onProgressRef = useRef(onProgress);
  const onEndedRef = useRef(onEnded);

  const isLoopRef = useRef(isLoop);

  useEffect(() => {
    isLoopRef.current = isLoop;
  }, [isLoop]);

  useEffect(() => {
    onReadyRef.current = onReady;
  }, [onReady]);
  useEffect(() => {
    onStateChangeRef.current = onStateChange;
  }, [onStateChange]);
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);
  useEffect(() => {
    onEndedRef.current = onEnded;
  }, [onEnded]);

  // ─── Progress ticker ────────────────────────────────────────────────────────
  const stopProgress = useCallback(() => {
    if (progressTimer.current) {
      clearInterval(progressTimer.current);
      progressTimer.current = null;
    }
  }, []);

  const startProgress = useCallback(() => {
    stopProgress();
    progressTimer.current = setInterval(() => {
      if (!playerRef.current) return;
      const current: number = playerRef.current.getCurrentTime?.() ?? 0;
      const duration: number = playerRef.current.getDuration?.() ?? 0;
      onProgressRef.current?.(Math.floor(current), Math.floor(duration));
    }, 1000);
  }, [stopProgress]);

  // ─── Player init / reinit when videoId changes ─────────────────────────────
  useEffect(() => {
    if (!videoId || !anchorRef.current) return;

    setIsReady(false);
    stopProgress();
    onProgressRef.current?.(0, 0);

    let destroyed = false; // guard against async race on fast videoId changes

    loadYTApi().then(() => {
      if (destroyed) return;

      // Destroy previous instance
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (_) {}
        playerRef.current = null;
      }

      playerRef.current = new window.YT.Player(anchorRef.current, {
        height: '100%',
        width: '100%',
        videoId,
        playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
        events: {
          onReady: (e: any) => {
            if (destroyed) return;
            setIsReady(true);
            onReadyRef.current?.(e);
          },
          onStateChange: (e: any) => {
            if (destroyed) return;
            const state = STATE_MAP[e.data] ?? 'Unstarted';
            onStateChangeRef.current?.(state);

            if (state === 'Playing') startProgress();
            else stopProgress();

            if (state === 'Ended') onEndedRef.current?.();

            // loop logic:
            if (state === 'Ended' && isLoopRef.current && playerRef.current) {
              // play again:
              playerRef.current.playVideo();
            }
          },
        },
      });
    });

    return () => {
      destroyed = true;
      stopProgress();
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (_) {}
        playerRef.current = null;
      }
      setIsReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  // ─── React to isPlaying prop ────────────────────────────────────────────────
  useEffect(() => {
    if (!isReady || !playerRef.current) return;
    isPlaying ? playerRef.current.playVideo() : playerRef.current.pauseVideo();
  }, [isPlaying, isReady]);

  // ─── Exposed actions ────────────────────────────────────────────────────────
  const play = useCallback(() => playerRef.current?.playVideo(), []);
  const pause = useCallback(() => playerRef.current?.pauseVideo(), []);

  // stop = pause and reset to the beginning
  const stop = useCallback(() => {
    playerRef.current?.pauseVideo();
    playerRef.current?.seekTo(0, true);
  }, []);

  const seekTo = useCallback((seconds: number) => {
    playerRef.current?.seekTo(seconds, true);
  }, []);

  const setLoop = useCallback((loop: boolean) => {
    playerRef.current?.setLoop(loop);
  }, []);

  const setVolume = useCallback((volume: number) => {
    playerRef.current?.setVolume(Math.max(0, Math.min(100, volume)));
  }, []);

  const mute = useCallback(() => playerRef.current?.mute(), []);
  const unmute = useCallback(() => playerRef.current?.unMute(), []);

  const getDuration = useCallback(() => playerRef.current?.getDuration?.() ?? 0, []);

  const getCurrentTime = useCallback(() => playerRef.current?.getCurrentTime?.() ?? 0, []);

  return {
    play,
    pause,
    stop,
    seekTo,
    setLoop,
    setVolume,
    mute,
    unmute,
    getDuration,
    getCurrentTime,
    isReady,
  };
};

export default useYTPlayer;
export type { UseYTPlayerParams, UseYTPlayerReturn, StateOptions };
