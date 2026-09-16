/**
 * Shared playback engine for background videos.
 *
 * Root cause of the recurring "video freezes after ~1.5–2s" reports: the
 * previous strategy started playback on the browser's optimistic signals
 * (canplaythrough / a blind timer fallback). On real-world devices — iOS
 * Safari, data-saver modes, weak cellular — media is NOT prefetched, so
 * playback was started while only the first ~1.5–2s of media were buffered.
 * The video then played straight into the edge of the buffer and froze.
 *
 * Rules enforced here:
 *  1. NEVER start on a timer or on heuristic readiness events. Playback
 *     starts only when the buffer is genuinely deep: the whole file, or at
 *     least MIN_START_AHEAD seconds of playable media ahead.
 *  2. Browsers that defer prefetching are "primed": a muted play()+pause()
 *     dance forces the data fetch to begin (the element is still invisible,
 *     so users only ever see the poster until smooth playback is running).
 *  3. A stall guard recovers playback if the network dips mid-playback:
 *     pause at the current frame, resume automatically once the buffer
 *     rebuilds. Once a video is fully buffered, looping costs no network at
 *     all and cannot stall.
 */

/** Seconds of forward buffer required before starting playback. */
export const MIN_START_AHEAD = 6;

/** Seconds of playable media ahead of the current position. */
export function bufferedAhead(v: HTMLVideoElement): number {
  const b = v.buffered;
  if (!b.length) return 0;
  for (let i = 0; i < b.length; i++) {
    if (b.start(i) - 0.05 <= v.currentTime && v.currentTime <= b.end(i)) {
      return b.end(i) - v.currentTime;
    }
  }
  return 0;
}

/** True when the entire file is buffered (playback can then never stall). */
export function fullyBuffered(v: HTMLVideoElement, tolerance = 0.3): boolean {
  return (
    Number.isFinite(v.duration) &&
    v.duration > 0 &&
    v.buffered.length > 0 &&
    v.buffered.end(v.buffered.length - 1) >= v.duration - tolerance
  );
}

/** Deep-enough buffer to start playback without a visible stall. */
export function canStartSmoothly(
  v: HTMLVideoElement,
  minAhead: number = MIN_START_AHEAD,
): boolean {
  return fullyBuffered(v) || bufferedAhead(v) >= minAhead;
}

/**
 * Watch for mid-playback stalls. If `waiting` persists and the buffer has
 * run dry, pause deterministically; resume as soon as 3s of media are
 * available again. Returns a detach function.
 */
export function attachStallGuard(v: HTMLVideoElement): () => void {
  let stalled = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  const onWaiting = () => {
    clearTimer();
    timer = setTimeout(() => {
      if (!v.paused && bufferedAhead(v) < 1) {
        stalled = true;
        v.pause();
      }
    }, 2500);
  };

  const onPlaying = () => {
    stalled = false;
    clearTimer();
  };

  const maybeResume = () => {
    if (stalled && v.paused && bufferedAhead(v) >= 3) {
      stalled = false;
      v.play().catch(() => undefined);
    }
  };

  v.addEventListener("waiting", onWaiting);
  v.addEventListener("playing", onPlaying);
  v.addEventListener("progress", maybeResume);
  v.addEventListener("canplay", maybeResume);

  return () => {
    clearTimer();
    v.removeEventListener("waiting", onWaiting);
    v.removeEventListener("playing", onPlaying);
    v.removeEventListener("progress", maybeResume);
    v.removeEventListener("canplay", maybeResume);
  };
}
