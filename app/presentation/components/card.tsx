type Stream = {
  id: string;
  title: string;
  thumbnail: string;
  viewerCount: number;
  channel: string;
};

export default function StreamCard({ stream }: { stream: Stream }) {
  return (
    <div className="group relative rounded-xl overflow-hidden shadow-lg transition transform hover:scale-[1.03] hover:shadow-2xl bg-gray-900">
      {/* Thumbnail với overlay gradient */}
      <div className="relative h-48 w-full">
        <img
          src={stream.thumbnail}
          alt={`${stream.title} thumbnail`}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3">
          <span className="text-sm text-white font-semibold">
            {/* 👁️ {stream.viewerCount.toLocaleString()} watching */}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-1">
        <h3 className="text-white font-bold text-lg truncate group-hover:text-purple-400">
          {stream.title}
        </h3>
        <p className="text-sm text-gray-400 group-hover:text-white">
          @{stream.channel}
        </p>
      </div>
    </div>
  );
}
