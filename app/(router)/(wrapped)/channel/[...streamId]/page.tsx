import ChatBox from "@/app/presentation/components/chatbox";
import StreamInfo from "@/app/presentation/components/stream-info";
import VideoPlayer from "@/app/presentation/components/video-player";
import { Suspense } from "react";
import Link from "next/link";
import { useStreamStore } from "@/app/store/streamStore";

interface StreamPageProps {
  params: { streamId: string };
}

export default function StreamPage({ params }: StreamPageProps) {
  const { streamId } = params;

  console.log("streamId", streamId);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer streamId={streamId} />
          {/* <StreamInfo streamId={streamId[0]} /> */}
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
