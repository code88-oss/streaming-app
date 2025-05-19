import ChatBox from "@/app/presentation/components/chatbox";
import StreamInfo from "@/app/presentation/components/stream-info";
import VideoPlayer from "@/app/presentation/components/video-player";
import { Suspense } from "react";
import Link from "next/link";

interface StreamPageProps {
  params: { username: string };
}

export default async function StreamPage({ params }: StreamPageProps) {
  const { username } = await params;
  return (
    <div className="p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VideoPlayer streamKey={username} />
          <StreamInfo username={username} />
        </div>
        <div>
          <Suspense fallback={<p>Loading chat...</p>}>
            <ChatBox roomId={username[0]} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
