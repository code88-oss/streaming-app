// hooks/useSocket.ts
"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket(url = "http://localhost:8080") {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(url, {
      transports: ["websocket"],
      withCredentials: true,
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [url]);

  return socket;
}
