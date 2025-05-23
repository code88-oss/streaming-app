// components/StreamStats.tsx
import React from "react";

interface StreamStatsProps {
  viewers?: number;
  totalViews?: number;
  followers?: number;
}

export default function StreamStats({
  viewers,
  totalViews,
  followers,
}: StreamStatsProps) {
  const hasData =
    viewers !== undefined &&
    totalViews !== undefined &&
    followers !== undefined;

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-semibold mb-4">Thống kê</h3>
      {hasData ? (
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-400">Người xem hiện tại</p>
            <p className="text-2xl font-bold">{viewers}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Lượt xem tổng</p>
            <p className="text-2xl font-bold">{totalViews}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Người theo dõi</p>
            <p className="text-2xl font-bold">{followers}</p>
          </div>
        </div>
      ) : (
        <p className="text-gray-400">
          Chưa có dữ liệu thống kê. Hãy bắt đầu phát trực tiếp để thu thập dữ
          liệu.
        </p>
      )}
    </div>
  );
}
