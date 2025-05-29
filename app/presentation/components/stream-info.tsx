"use client";

import { useEffect, useState } from "react";
import { getStreamByStreamIdAction } from "@/app/actions/streaming";
import { useParams } from "next/navigation";
import { User, Tags, Globe, Gamepad2 } from "lucide-react";
import useSocketViewer from "../hooks/useSocketViewer";

export default function StreamInfo() {
  const { streamId } = useParams() as { streamId: string };
  const [info, setInfo] = useState<any>(null);
  const viewerCount = useSocketViewer(streamId);

  useEffect(() => {
    const fetchInfo = async () => {
      const stream = await getStreamByStreamIdAction(streamId);
      if (stream) setInfo(stream);
    };
    fetchInfo();
  }, [streamId]);

  if (!info) return null;

  const tags = info.streamTags?.map((t: any) => t.tag?.name).filter(Boolean);

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 text-white shadow-xl">
      <h3 className="text-2xl font-bold mb-5 text-purple-400">
        Thông tin kênh
      </h3>
      <div className="space-x-4 text-sm text-white">
        👁️ Đang xem:{" "}
        <span className="font-bold text-green-400">{viewerCount}</span>
      </div>
      <div className="space-y-4 text-sm">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Tên kênh:</span>
          <span className="font-medium text-white">
            {info.user?.username || "N/A"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Gamepad2 className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Danh mục:</span>
          <span className="font-medium text-white">
            {info.category?.name || "Chưa có"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <span className="text-gray-400">Ngôn ngữ:</span>
          <span className="font-medium text-white">
            {tags.length > 0 ? tags.join(", ") : "Chưa đặt"}
          </span>
        </div>

        {tags.length > 0 && (
          <div className="flex items-center gap-2">
            <Tags className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">Thẻ:</span>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
