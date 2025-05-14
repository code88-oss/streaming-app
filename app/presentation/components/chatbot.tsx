"use client";

import { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";
import useUserFromCookie from "../hooks/useUserFromCookie";

interface ChatBoxInfoProps {
  roomId: string;
}

interface Message {
  roomId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

export default function ChatBox({ roomId }: ChatBoxInfoProps) {
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const user = useUserFromCookie();

  console.log("messages", messages);
  useEffect(() => {
    if (!socket) return;

    socket.emit("joinRoom", roomId);

    const handleMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("newMessage", handleMessage);

    return () => {
      socket.off("newMessage", handleMessage);
    };
  }, [socket, roomId]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      socket.emit("sendMessage", {
        roomId: roomId,
        senderId: user?.username,
        message: message.trim(),
      });
      setMessage("");
    }
  };

  return (
    <div className="bg-[#1f1f23] p-4 rounded-lg h-[615px] flex flex-col">
      <div className="flex-1 overflow-y-auto text-sm text-white space-y-1">
        {messages.map((msg, index) => (
          <p key={index} className="bg-[#2a2a2e] p-2 rounded">
            <strong>{msg.senderId}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Send a message"
        className="mt-2 p-2 rounded bg-[#2a2a2e] text-white text-sm"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        disabled={!socket}
      />
    </div>
  );
}
