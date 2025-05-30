"use client";

import { useStreamStore } from "@/app/store/streamStore";
import { CirclePlay } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  streamId: string;
  streamKey: string;
}

export default function VideoPlayer({ streamId, streamKey }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const urlServer = process.env.NEXT_PUBLIC_STREAM_URL;
  const streamUrl = `https://${urlServer}/live`;

  useEffect(() => {
    let player: any = null;

    // Chỉ chạy khi client mount và isPlaying = true
    if (isPlaying && videoRef.current) {
      (async () => {
        const flvjs = await import("flv.js");
        if (!flvjs.isSupported()) {
          console.error("FLV.js not supported in this browser");
          return;
        }
        player = flvjs.createPlayer({
          type: "flv",
          url: `${streamUrl}/${streamKey}.flv`,
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
  }, [isPlaying]);

  return (
    <div className="rounded-lg overflow-hidden bg-black relative w-full">
      {!isPlaying && (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 z-10 bg-black bg-opacity-50 text-white text-lg flex items-center justify-center"
        >
          <CirclePlay size={48} />
        </button>
      )}
      <video ref={videoRef} controls muted className="w-full aspect-video" />
    </div>
  );
}
