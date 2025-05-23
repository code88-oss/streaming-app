// app/actions/stream.ts
"use server";
import { cookies } from "next/headers";
import { Message } from "../presentation/types/message";
import { revalidatePath } from "next/cache";

export interface UpdateStreamPayload {
  id: string; // streamId
  title?: string;
  categoryId?: number;
  streamKey?: string;
  serverUrl?: string;
  tagIds?: number[];
  status?: "live" | "offline";
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

export async function createStreamAction(formData: {
  title: string;
  categoryId?: string;
  tagIds?: string[];
  thumbnailUrl?: string;
}) {
  const accessToken = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(`${process.env.NESTJS_API_URL}/streams/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      throw new Error("Failed to create stream");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error creating stream:", error);
    throw error;
  }
}

export async function getAllStreams() {
  try {
    const res = await fetch(`${process.env.NESTJS_API_URL}/streams`, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch streams");
    }

    const data = await res.json();
    console.log("data", data);
    return data;
  } catch (error) {
    console.error("Error fetching streams:", error);
    throw error;
  }
}

export async function updateStreamAction(
  id: string,
  data: {
    title?: string;
    thumbnailUrl?: string;
    status?: "live" | "offline";
  }
) {
  const accessToken = (await cookies()).get("accessToken")?.value;
  const res = await fetch(`${process.env.NESTJS_API_URL}/streams/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Update failed");
  return await res.json();
}
