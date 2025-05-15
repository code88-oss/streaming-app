import ChatBox from "@/app/presentation/components/chatbot";
import StreamInfo from "@/app/presentation/components/stream-info";
import VideoPlayer from "@/app/presentation/components/video-player";
import { Suspense } from "react";

interface StreamPageProps {
  params: { username: string };
}

export default function StreamPage({ params }: StreamPageProps) {
  const { username } = params;
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4">
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
  );
}
