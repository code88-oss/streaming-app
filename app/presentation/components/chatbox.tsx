"use client";

import { useState, useEffect } from "react";
import useSocket from "../hooks/useSocket";
import useUserFromCookie from "../hooks/useUserFromCookie";
import Link from "next/link";
import { Message } from "../types/message";
import { getMessages } from "@/app/actions/streaming";

interface ChatBoxInfoProps {
  roomId: string;
}

export default function ChatBox({ roomId }: ChatBoxInfoProps) {
  const socket = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const user = useUserFromCookie();

  console.log("roomId", roomId);
  useEffect(() => {
    // Lấy message cũ từ API
    const fetchMessages = async () => {
      const fetchedMessages = await getMessages(roomId);
      setMessages(
        fetchedMessages.map((msg) => ({
          ...msg,
          timestamp: msg.createdAt, // Chuyển createdAt thành timestamp cho đồng bộ
        }))
      );
    };

    fetchMessages();
  }, [roomId]);

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
    if (!user) {
      alert("Vui lòng đăng nhập để chat.");
      return;
    }
    if (socket && message.trim()) {
      socket.emit("sendMessage", {
        roomId: roomId,
        senderId: user.username,
        content: message.trim(),
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

      {!user ? (
        <div className="mt-2 flex items-center justify-center">
          <p className="text-blue-400 text-sm mr-2">
            Bạn phải đăng nhập để chat
          </p>
        </div>
      ) : (
        <input
          type="text"
          placeholder="Send a message"
          className="mt-2 p-2 rounded bg-[#2a2a2e] text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          disabled={!socket}
        />
      )}
    </div>
  );
}
