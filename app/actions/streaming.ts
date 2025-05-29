// app/actions/stream.ts
"use server";
import { cookies } from "next/headers";
import { Message } from "../presentation/types/message";

export interface UpdateStreamPayload {
  id: string; // streamId
  title?: string;
  categoryId?: number;
  streamKey?: string;
  serverUrl?: string;
  tagIds?: number[];
  status?: "live" | "offline";
}

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

export async function getCategoriesAction(): Promise<Category[]> {
  try {
    const res = await fetch(`${process.env.NESTJS_API_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data: Category[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Unable to load categories");
  }
}

export async function getTagsAction(): Promise<Tag[]> {
  try {
    const res = await fetch(`${process.env.NESTJS_API_URL}/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!res.ok) {
      throw new Error("Failed to fetch tags");
    }

    const data: Tag[] = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Unable to load tags");
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

export async function createStreamAction(formData: {
  title: string;
  categoryId?: string;
  tagIds?: string[];
  thumbnailUrl?: string;
  streamKey: string;
  streamUrl: string;
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
    return data;
  } catch (error) {
    console.error("Error fetching streams:", error);
    throw error;
  }
}

export async function getStreamByUserId(userId: string) {
  try {
    const res = await fetch(`${process.env.NESTJS_API_URL}/streams/${userId}`, {
      method: "GET",
      cache: "no-store",
    });

    if (res.status === 404) {
      // ✅ Không có stream nào cho user này
      return null;
    }

    if (!res.ok) {
      const errorMsg = `Failed to fetch stream. Status: ${res.status}`;
      console.error(errorMsg);
      throw new Error(errorMsg);
    }

    return await res.json();
  } catch (error) {
    console.error("❌ Error fetching stream by userId:", error);
    throw error;
  }
}

export async function updateStreamAction(
  id: string,
  data: {
    title?: string;
    thumbnailUrl?: string;
    categories?: [];
    tags?: [];
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

export async function getStreamStatus() {
  const accessToken = (await cookies()).get("accessToken")?.value;

  if (!accessToken) {
    return {
      streamId: null,
      status: "offline",
      message: "User not authenticated",
    };
  }

  const res = await fetch(`${process.env.NESTJS_API_URL}/streams/status`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return {
      streamId: null,
      status: "offline",
      message: "Failed to fetch stream status",
    };
  }

  return res.json();
}

interface UpdateStreamInfoPayload {
  title?: string;
  thumbnailUrl?: string;
  categoryId?: string;
  tagIds?: string[];
}

export async function updateStreamInfoAction(
  streamId: string,
  data: UpdateStreamInfoPayload
) {
  const accessToken = (await cookies()).get("accessToken")?.value;

  if (!accessToken) {
    throw new Error("Unauthorized: Missing access token");
  }

  const res = await fetch(
    `${process.env.NESTJS_API_URL}/streams/${streamId}/info`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Failed to update stream info:", errorText);
    throw new Error("Failed to update stream info");
  }

  return await res.json();
}

export async function getStreamByStreamIdAction(streamId: string) {
  const res = await fetch(
    `${process.env.NESTJS_API_URL}/streams/by-id/${streamId}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch stream");

  return await res.json();
}
