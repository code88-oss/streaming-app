"use client";

import { useEffect, useRef } from "react";
import Hls from "hls.js";

interface VideoPlayerProps {
  streamKey: string;
}

export default function VideoPlayer({ streamKey }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(`http://localhost:8080/hls/${streamKey}.m3u8`);
      hls.attachMedia(videoRef.current);
    }
  }, [streamKey]);

  return (
    <div className="rounded-lg overflow-hidden bg-black">
      <video ref={videoRef} controls className="w-full aspect-video" />
    </div>
  );
}
