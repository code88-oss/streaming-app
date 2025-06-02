"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocketViewer(streamId: string) {
  const [viewerCount, setViewerCount] = useState(0);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!streamId) return;

    const apiUrl =
      process.env.NESTJS_API_URL || "https://streaming-app-be-1.onrender.com";

    const socket = io(`${apiUrl}/streams`, {
      query: { streamId },
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(`📡 Connected to viewer stream: ${streamId}`);
    });

    socket.on("viewerCount", (count: number) => {
      setViewerCount(count);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from viewer stream");
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error (viewer):", err);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [streamId]);

  return viewerCount;
}
