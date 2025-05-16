// app/presentation/components/video-player.tsx
"use client";

import { CirclePlay } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  streamKey: string;
}

export default function VideoPlayer({ streamKey }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let player: any = null;

    // chỉ chạy khi client mount và isPlaying = true
    if (isPlaying && videoRef.current) {
      (async () => {
        const flvjs = await import("flv.js");
        if (!flvjs.isSupported()) {
          console.error("FLV.js not supported in this browser");
          return;
        }
        player = flvjs.createPlayer({
          type: "flv",
          // thay streamKey vào url nếu cần
          url: `http://18.143.77.84:8000/live/testkey.flv`,
          isLive: true,
        });
        player.attachMediaElement(videoRef.current!);
        player.load();
        player
          .play()
          .catch((err: any) => console.error("Playback error:", err));
      })();
    }

    return () => {
      if (player) {
        player.destroy();
        player = null;
      }
    };
  }, [streamKey, isPlaying]);

  return (
    <div className="rounded-lg overflow-hidden bg-black relative">
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 z-10 bg-black bg-opacity-50 text-white text-lg flex items-center justify-center"
        >
          {/* Giờ CirclePlay là React component */}
          <CirclePlay size={48} />
        </button>
      )}
      <video ref={videoRef} controls muted className="w-full aspect-video" />
    </div>
  );
}
