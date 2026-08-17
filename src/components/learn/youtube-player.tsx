"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Play, TriangleAlert } from "lucide-react";

// Minimal ambient typing for the official YouTube IFrame Player API — no
// @types/youtube dependency, just the shape of the two calls this component
// actually uses. Loaded via a plain <script> tag, no API key required (that's
// only needed for the separate YouTube Data API, which this doesn't touch).
type YTPlayerEvent = { data?: number };
type YTPlayer = { destroy: () => void };
type YTPlayerConstructor = new (
  elementId: string,
  options: {
    videoId: string;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: () => void;
      onError?: (event: YTPlayerEvent) => void;
    };
  },
) => YTPlayer;

declare global {
  interface Window {
    YT?: { Player: YTPlayerConstructor };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const IFRAME_API_SCRIPT_ID = "youtube-iframe-api";
const READY_TIMEOUT_MS = 10_000;

function loadIframeApi(onReady: () => void) {
  if (window.YT?.Player) {
    onReady();
    return;
  }
  const previous = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    previous?.();
    onReady();
  };
  if (!document.getElementById(IFRAME_API_SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = IFRAME_API_SCRIPT_ID;
    script.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(script);
  }
}

export function YouTubePlayer({ videoId, title }: { videoId: string; title: string }) {
  const containerId = useId().replace(/:/g, "");
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    if (!started || failed) return;

    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled && !playerRef.current) setFailed(true);
    }, READY_TIMEOUT_MS);

    loadIframeApi(() => {
      if (cancelled) return;
      try {
        playerRef.current = new window.YT!.Player(containerId, {
          videoId,
          playerVars: {
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: () => clearTimeout(timeout),
            // Error codes: 2 invalid parameter, 5 HTML5 player error,
            // 100 video not found/removed/private, 101/150 embedding
            // disabled by the video owner — all render the same fallback.
            onError: () => setFailed(true),
          },
        });
      } catch {
        setFailed(true);
      }
    });

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [started, failed, containerId, videoId]);

  if (failed) {
    return (
      <div className="mt-8 flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-2xl border border-ink/10 bg-paper/60 text-center text-ink-muted">
        <TriangleAlert aria-hidden="true" className="h-6 w-6" />
        <p className="text-sm">Video unavailable. Please try again later.</p>
      </div>
    );
  }

  if (!started) {
    return (
      <button
        type="button"
        onClick={() => setStarted(true)}
        aria-label={`Play video: ${title}`}
        className="group relative mt-8 block aspect-video w-full overflow-hidden rounded-2xl border border-ink/10 bg-ink/5"
      >
        <Image
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, 640px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
        <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
            <Play aria-hidden="true" className="h-7 w-7 fill-teal-deep text-teal-deep" />
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-ink/10">
      <div id={containerId} className="h-full w-full" />
    </div>
  );
}
