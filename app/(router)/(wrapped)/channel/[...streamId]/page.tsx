"use client";

import { useParams, useSearchParams } from "next/navigation";
import VideoPlayer from "@/app/presentation/components/video-player";
import ChatBox from "@/app/presentation/components/chatbox";
import { Suspense } from "react";
import StreamInfo from "@/app/presentation/components/stream-info";

export default function StreamPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const streamId = params.streamId as string;
  const streamKey = searchParams.get("streamKey") || "";

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer streamId={streamId} streamKey={streamKey} />
          <div className="mt-2">
            <StreamInfo />
          </div>
        </div>

        <div>
          <Suspense fallback={<p>Loading chat...</p>}>
            <ChatBox roomId={streamId[0]} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
