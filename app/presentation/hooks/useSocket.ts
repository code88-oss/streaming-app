"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket(namespace: string = "", userId?: string) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NESTJS_API_URL || "http://localhost:8080";
    const socketUrl = namespace ? `${apiUrl}${namespace}` : apiUrl;

    const socketInstance = io(socketUrl, {
      query: userId ? { userId } : {},
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Lưu trữ socket vào ref
    socketRef.current = socketInstance;

    // Lắng nghe sự kiện kết nối thành công
    socketInstance.on("connect", () => {
      console.log(`Connected to WebSocket: ${socketUrl}`);
    });

    // Lắng nghe sự kiện lỗi kết nối
    socketInstance.on("connect_error", (err) => {
      console.error("Connection error:", err);
    });

    // Dọn dẹp khi component unmount
    return () => {
      if (socketRef.current) {
        console.log(`Disconnecting WebSocket: ${socketUrl}`);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [namespace, userId]);

  return socketRef.current;
}
