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
      <div className="rounded-lg overflow-hidden bg-[#2a2a2e] shadow-md hover:shadow-xl hover:bg-[#33333a] transition-transform transform hover:-translate-y-1">
        <div className="relative h-48 w-full">
          <Image
            src={stream.thumbnail}
            alt={stream.title}
            fill
            className="object-cover"
          />
          <span className="absolute top-2 left-2 bg-indigo-600 text-xs font-semibold text-white px-2 py-1 rounded">
            LIVE
          </span>
          <span className="absolute bottom-2 right-2 bg-black/60 text-xs text-gray-200 px-2 py-1 rounded">
            {stream.viewerCount.toLocaleString()} viewers
          </span>
        </div>
        <div className="p-3 bg-gradient-to-t from-[#1f1f23] to-transparent">
          <p className="text-sm font-semibold text-indigo-200 truncate">
            {stream.title}
          </p>
          <p className="text-xs text-indigo-100">{stream.channel}</p>
        </div>
      </div>
    </Link>
  );
}
