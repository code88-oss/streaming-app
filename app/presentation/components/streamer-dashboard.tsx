"use client";

import React, { useState } from "react";
import ChatBox from "./chatbox";

// Component: StreamPreview
interface StreamPreviewProps {
  streamId: string;
  status: "offline" | "starting" | "live";
}

const StreamPreview: React.FC<StreamPreviewProps> = ({ streamId, status }) => {
  if (status !== "live") {
    return (
      <div className="bg-[#2a2a2e] rounded-md p-4 mb-6 text-center text-gray-400">
        Stream chưa hoạt động
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-300 mb-2">
        Xem trước Stream
      </h2>
      <div className="relative aspect-video bg-[#2a2a2e] rounded-md overflow-hidden">
        <video
          autoPlay
          muted
          controls
          className="w-full h-full"
          src={`http://your-streaming-server:8000/live/${streamId}.m3u8`} // Thay bằng URL HLS thực tế
        />
      </div>
    </div>
  );
};

// Component: StreamInfoForm
const categories = [
  "Just Chatting",
  "Gaming",
  "IRL",
  "Music",
  "Esports",
  "Creative",
];

interface StreamInfoFormProps {
  streamData: { title: string; category: string; tags: string[] };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleAddTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  handleRemoveTag: (tag: string) => void;
  tagInput: string;
  setTagInput: (value: string) => void;
  isStreaming: boolean;
}

const StreamInfoForm: React.FC<StreamInfoFormProps> = ({
  streamData,
  handleInputChange,
  handleAddTag,
  handleRemoveTag,
  tagInput,
  setTagInput,
  isStreaming,
}) => (
  <div className="space-y-4 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Tiêu đề stream
      </label>
      <input
        type="text"
        name="title"
        value={streamData.title}
        onChange={handleInputChange}
        placeholder="Nhập tiêu đề stream..."
        className="w-full bg-[#2a2a2e] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9147ff]"
        disabled={isStreaming}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Danh mục
      </label>
      <select
        name="category"
        value={streamData.category}
        onChange={handleInputChange}
        className="w-full bg-[#2a2a2e] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9147ff]"
        disabled={isStreaming}
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Tags
      </label>
      <input
        type="text"
        value={tagInput}
        onChange={(e) => setTagInput(e.target.value)}
        onKeyDown={handleAddTag}
        placeholder="Nhấn Enter để thêm tag..."
        className="w-full bg-[#2a2a2e] text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#9147ff]"
        disabled={isStreaming}
      />
      <div className="flex flex-wrap gap-2 mt-2">
        {streamData.tags.map((tag) => (
          <span
            key={tag}
            className="bg-[#9147ff] text-white px-2 py-1 rounded-full text-sm flex items-center"
          >
            {tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1 text-white hover:text-red-300"
              disabled={isStreaming}
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  </div>
);

// Component: StreamControls
interface StreamControlsProps {
  isStreaming: boolean;
  handleStartStream: () => void;
}

const StreamControls: React.FC<StreamControlsProps> = ({
  isStreaming,
  handleStartStream,
}) => (
  <div className="mb-6">
    <button
      onClick={handleStartStream}
      className={`w-full py-3 rounded-md font-semibold transition ${
        isStreaming
          ? "bg-red-600 hover:bg-red-700"
          : "bg-[#9147ff] hover:bg-[#a970ff]"
      }`}
    >
      {isStreaming ? "Dừng Stream" : "Bắt đầu Stream"}
    </button>
  </div>
);

// Component: StreamKeyDisplay
interface StreamKeyDisplayProps {
  streamKey: string;
  serverUrl: string;
}

const StreamKeyDisplay: React.FC<StreamKeyDisplayProps> = ({
  streamKey,
  serverUrl,
}) => (
  <div className="space-y-4 mb-6">
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Server URL (cho OBS)
      </label>
      <div className="flex items-center bg-[#2a2a2e] px-3 py-2 rounded-md">
        <input
          type="text"
          value={serverUrl}
          readOnly
          className="flex-1 bg-transparent text-white focus:outline-none"
        />
        <button
          onClick={() => navigator.clipboard.writeText(serverUrl)}
          className="ml-2 text-[#9147ff] hover:text-[#a970ff]"
        >
          Copy
        </button>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-1">
        Stream Key
      </label>
      <div className="flex items-center bg-[#2a2a2e] px-3 py-2 rounded-md">
        <input
          type="text"
          value={streamKey}
          readOnly
          className="flex-1 bg-transparent text-white focus:outline-none"
        />
        <button
          onClick={() => navigator.clipboard.writeText(streamKey)}
          className="ml-2 text-[#9147ff] hover:text-[#a970ff]"
        >
          Copy
        </button>
      </div>
    </div>
    <p className="text-sm text-gray-400">
      Hướng dẫn: Mở OBS Studio, vào Settings Stream, chọn Service "Custom", dán
      Server URL và Stream Key, rồi nhấn Start Streaming.
    </p>
  </div>
);

// Component: StreamStatus
interface StreamStatusProps {
  status: string;
}

const StreamStatus: React.FC<StreamStatusProps> = ({ status }) => (
  <div className="text-center">
    <p className="text-lg font-semibold">
      Trạng thái:{" "}
      <span
        className={
          status === "live"
            ? "text-green-500"
            : status === "starting"
            ? "text-yellow-500"
            : "text-red-500"
        }
      >
        {status.toUpperCase()}
      </span>
    </p>
  </div>
);

// Component chính: StreamerDashboard
const StreamerDashboard: React.FC = () => {
  const [streamData, setStreamData] = useState({
    id: "",
    title: "",
    category: categories[0],
    tags: [] as string[],
    streamKey: "",
    serverUrl: "",
    status: "offline" as "offline" | "starting" | "live",
  });
  const [tagInput, setTagInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStreamData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setStreamData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setStreamData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleStartStream = () => {
    if (!isStreaming) {
      const streamId = `stream_${Math.random().toString(36).substring(7)}`;
      setStreamData((prev) => ({
        ...prev,
        id: streamId,
        status: "starting",
        streamKey: `dummy_stream_key_${streamId}`,
        serverUrl: "rtmp://dummy-server/live",
      }));
      setTimeout(() => {
        setStreamData((prev) => ({ ...prev, status: "live" }));
        setIsStreaming(true);
      }, 2000);
    } else {
      setStreamData((prev) => ({
        ...prev,
        id: "",
        status: "offline",
        streamKey: "",
        serverUrl: "",
      }));
      setIsStreaming(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e10] flex items-center justify-center p-6">
      <div className="w-full max-w-none bg-[#18181b] rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold text-[#9147ff] mb-6">
          Streamer Dashboard
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full mb-6">
          <div className="lg:col-span-2">
            <StreamPreview
              streamId={streamData.id}
              status={streamData.status}
            />
          </div>
          {isStreaming && (
            <div className="lg:col-span-1">
              <ChatBox roomId="thai" />
            </div>
          )}
        </div>

        <StreamInfoForm
          streamData={streamData}
          handleInputChange={handleInputChange}
          handleAddTag={handleAddTag}
          handleRemoveTag={handleRemoveTag}
          tagInput={tagInput}
          setTagInput={setTagInput}
          isStreaming={isStreaming}
        />

        <StreamControls
          isStreaming={isStreaming}
          handleStartStream={handleStartStream}
        />

        {streamData.streamKey && streamData.serverUrl && (
          <StreamKeyDisplay
            streamKey={streamData.streamKey}
            serverUrl={streamData.serverUrl}
          />
        )}

        <StreamStatus status={streamData.status} />
      </div>
    </div>
  );
};

export default StreamerDashboard;
