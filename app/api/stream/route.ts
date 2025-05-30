// app/api/stream/status/route.ts
import { getStreamStatus } from "@/app/actions/streaming";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const status = await getStreamStatus();
  console.log("status", status);
  return NextResponse.json(status);
}
