// app/api/stream/status/route.ts
import { getStreamStatus } from "@/app/actions/streaming";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const status = await getStreamStatus(); // gọi server action từ server
  return NextResponse.json(status);
}
