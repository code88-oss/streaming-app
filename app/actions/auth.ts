"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

// Khởi tạo rate limiting với Upstash Redis
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "10 s"), // 5 requests trong 10 giây
  analytics: true,
});

interface DecodedToken {
  sub: number;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

const loginSchema = z.object({
  identifier: z.string().min(3, "Username or email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

// Zod schema cho dữ liệu form
const signupSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username is too long"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

export async function signup(_state: any, formData: FormData) {
  // Rate limiting
  if (!(await ratelimit.limit("signup")).success) {
    return { success: false, error: "Too many requests" };
  }

  try {
    // Validate
    const data = signupSchema.parse({
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Gọi API
    const response = await fetch(`${process.env.NESTJS_API_URL}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.error || "Signup failed" };
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }

  // Redirect
  redirect("/login");
}

export async function login(_state: any, formData: FormData) {
  // Rate limiting
  if (!(await ratelimit.limit("login")).success) {
    return { success: false, error: "Too many requests" };
  }

  try {
    // Validate
    const { identifier, password } = loginSchema.parse({
      identifier: formData.get("username"),
      password: formData.get("password"),
    });

    // Chuẩn bị payload
    const payload = identifier.includes("@")
      ? { email: identifier, password }
      : { username: identifier, password };

    // Gọi API
    const response = await fetch(`${process.env.NESTJS_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { success: false, error: errorData.message || "Login failed" };
    }

    const { accessToken } = await response.json();
    if (!accessToken) {
      return { success: false, error: "No access token received" };
    }

    // Set cookie
    (await cookies()).set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600,
      path: "/",
    });

    // Revalidate cache
    revalidatePath("/");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: "An unexpected error occurred" };
  }

  // Redirect
  redirect("/dashboard");
}

export async function getUserFromToken() {
  const accessToken = (await cookies()).get("accessToken")?.value;
  console.log("accessToken", accessToken);
  if (!accessToken) {
    return { error: "Access token not found" };
  }

  try {
    // Verify token và ép kiểu an toàn
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as unknown;
    console.log("decoded", decoded);
    // Kiểm tra decoded có phải object và chứa các thuộc tính cần thiết
    if (
      decoded &&
      typeof decoded === "object" &&
      "username" in decoded &&
      "email" in decoded &&
      "sub" in decoded
    ) {
      const user: DecodedToken = decoded as DecodedToken;
      return user;
    } else {
      return { error: "Invalid token payload" };
    }
  } catch (error) {
    console.error("Error decoding token:", error);
    return { error: "Invalid token" };
  }
}
