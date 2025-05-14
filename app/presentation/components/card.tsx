import Image from "next/image";
import Link from "next/link";

type Stream = {
  id: string;
  channel: string;
  title: string;
  thumbnail: string;
  viewerCount: number;
};

export default function StreamCard({ stream }: { stream: Stream }) {
  return (
    <Link href={`/channel/${stream.channel}`}>
      <div className="rounded-lg overflow-hidden bg-[#1f1f23] hover:bg-[#26262b] transition">
        <div className="relative h-48 w-full">
          <Image
            src={stream.thumbnail}
            alt={stream.title}
            fill
            className="object-cover"
          />
          <span className="absolute top-2 left-2 bg-red-600 text-xs text-white px-2 py-1 rounded">
            LIVE
          </span>
          <span className="absolute bottom-2 right-2 bg-black/60 text-xs text-white px-2 py-1 rounded">
            {stream.viewerCount.toLocaleString()} viewers
          </span>
        </div>
        <div className="p-3">
          <p className="text-sm font-semibold text-white truncate">
            {stream.title}
          </p>
          <p className="text-xs text-gray-400">{stream.channel}</p>
        </div>
      </div>
    </Link>
  );
}
