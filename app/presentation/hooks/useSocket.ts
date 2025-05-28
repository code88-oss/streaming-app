"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket(
  namespace: string = "",
  userId?: string,
  roomId?: string
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const apiUrl = process.env.NESTJS_API_URL || "http://localhost:8080";
    const socketUrl = namespace ? `${apiUrl}${namespace}` : apiUrl;

    const socketInstance = io(socketUrl, {
      query: { userId },
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socketInstance;

    socketInstance.on("connect", () => {
      console.log(`✅ Connected to WebSocket: ${socketUrl}`);

      if (roomId) {
        socketInstance.emit("joinRoom", { roomId });
      }
    });

    socketInstance.on("joinedRoom", (data) => {
      console.log(`🎉 Joined room: ${data.roomId}`);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("❌ Connection error:", err);
    });

    return () => {
      if (socketRef.current) {
        console.log(`👋 Disconnecting WebSocket: ${socketUrl}`);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [namespace, userId, roomId]);

  return socketRef.current;
}
