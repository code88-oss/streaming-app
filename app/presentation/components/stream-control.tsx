// components/StreamControls.tsx
import { Circle } from "lucide-react";

export default function StreamControls() {
  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md mt-6 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Circle className="w-4 h-4 text-green-400" />
        <p className="text-lg font-bold text-green-400">Đang trực tiếp</p>
      </div>
      <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
        Kết thúc luồng
      </button>
    </div>
  );
}
