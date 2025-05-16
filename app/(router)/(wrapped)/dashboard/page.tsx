import { Suspense } from "react";
import StreamCard from "@/app/presentation/components/card";

const fetchRecommendedStreams = async () => {
  return [
    {
      id: "1",
      title: "Just Chatting with xQc",
      thumbnail: "/logo/photo-streamer.avif",
      viewerCount: 15000,
      channel: "xQc",
    },
    {
      id: "2",
      title: "Valorant Ranked",
      thumbnail: "/logo/photo-streamer.avif",
      viewerCount: 8000,
      channel: "shroud",
    },
    {
      id: "3",
      title: "Minecraft Speedrun",
      thumbnail: "/logo/photo-streamer.avif",
      viewerCount: 5000,
      channel: "Dream",
    },
  ];
};

export default async function Home() {
  const streams = await fetchRecommendedStreams();

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-gray-900 text-gray-100">
      <main className="mx-auto max-w-7xl px-4 py-6">
        <section className="mb-8">
          <div className="relative h-64 overflow-hidden rounded-lg shadow-lg">
            <iframe
              src="https://player.twitch.tv/?channel=demon1&parent=localhost"
              className="absolute top-0 left-0 h-full w-full rounded-lg"
              allowFullScreen
            />
            <div className="absolute bottom-0 left-0 z-10 bg-gradient-to-t from-black/80 to-transparent w-full p-6">
              <h2 className="text-2xl font-bold">Featured Stream</h2>
              <p className="text-sm text-gray-300">
                Watch top creators live now!
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-200">
            Live Channels We Think You'll Like
          </h2>
          <Suspense
            fallback={
              <p className="text-center text-gray-400">Loading streams...</p>
            }
          >
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {streams.map((stream) => (
                <StreamCard key={stream.id} stream={stream} />
              ))}
            </div>
          </Suspense>
        </section>
      </main>
    </div>
  );
}
