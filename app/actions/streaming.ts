// app/actions/stream.ts
"use server";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";
import { Message } from "../presentation/types/message";

interface DecodedToken {
  sub: number;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export async function getStreamUrl(streamId: string) {
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as unknown;
    // Gọi NestJS endpoint
    const response = await fetch(
      `${process.env.NESTJS_API_URL}/stream/${streamId}`,
      {
        headers: { Cookie: `accessToken=${accessToken}` },
      }
    );
    if (!response.ok) {
      throw new Error("Không thể tải stream");
    }
    const data = await response.json();
    return data.streamUrl; // http://3.123.45.67:8000/live/shroud/index.m3u8
  } catch (error) {
    throw new Error("Lỗi khi lấy stream URL: " + (error as Error).message);
  }
}

export async function startStream() {
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as unknown;
    const response = await fetch(`${process.env.NESTJS_API_URL}/stream/start`, {
      method: "POST",
      headers: { Cookie: `accessToken=${accessToken}` },
    });
    if (!response.ok) {
      throw new Error("Không thể khởi tạo stream");
    }
    const data = await response.json();
    return data; // { rtmpUrl, streamKey, streamId }
  } catch (error) {
    throw new Error("Lỗi khi khởi tạo stream: " + (error as Error).message);
  }
}

export async function getMessages(roomId: string): Promise<Message[]> {
  try {
    const response = await fetch(
      `${process.env.NESTJS_API_URL}/messages?roomId=${roomId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Đảm bảo dữ liệu mới nhất
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch messages");
    }

    const messages: Message[] = await response.json();
    return messages;
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}
