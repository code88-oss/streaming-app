import { formatDistanceToNow } from "date-fns";

interface Tag {
  id: string;
  name: string;
}

interface StreamTag {
  id: number;
  tagId: string;
  tag: Tag;
}

interface Stream {
  id: string;
  title: string;
  thumbnailUrl: string;
  views: number | null;
  channel: string | null;
  status: "live" | "offline";
  startedAt: string | null;
  streamTags: StreamTag[];
}

export default function StreamCard({ stream }: { stream: Stream }) {
  // Fallbacks for null values
  const views = stream.views ?? 0;
  const channel = stream.channel ?? "Unknown Channel";
  const startedAt = stream.startedAt
    ? formatDistanceToNow(new Date(stream.startedAt), { addSuffix: true })
    : "Not started";

  return (
    <div className="group relative rounded-xl overflow-hidden shadow-lg transition transform hover:scale-[1.03] hover:shadow-2xl bg-gray-900">
      {/* Thumbnail with overlay gradient */}
      <div className="relative h-48 w-full">
        <img
          src={stream.thumbnailUrl}
          alt={`${stream.title} thumbnail`}
          className="h-full w-full object-cover"
        />
        {stream.status === "live" && (
          <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            Live
          </span>
        )}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-3 flex justify-between items-end">
          <span className="text-sm text-white font-semibold">
            👁️ {views.toLocaleString()} watching
          </span>
          <span className="text-xs text-gray-300">{startedAt}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 space-y-2">
        <h3 className="text-white font-bold text-lg truncate group-hover:text-purple-400">
          {stream.title}
        </h3>
        <p className="text-sm text-gray-400 group-hover:text-white">
          @{channel}
        </p>
        {stream.streamTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {stream.streamTags.map((streamTag) => (
              <span
                key={streamTag.tagId}
                className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
              >
                {streamTag.tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
