"use client";

import { useState, useEffect } from "react";
import {
  Copy,
  Eye,
  EyeOff,
  Play,
  StopCircle,
  Settings,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  createStreamAction,
  updateStreamAction,
} from "@/app/actions/streaming";
import useUserFromCookie from "@/app/presentation/hooks/useUserFromCookie";

export default function CreatorDashboard() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings">(
    "dashboard"
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const user: any = useUserFromCookie();
  const streamUrl = "rtmp://18.143.77.84:1935/live";
  const streamKey = "testkey";
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const [streamId, setStreamId] = useState("12345");

  const handleStreamToggle = async () => {
    try {
      if (!streamId) {
        // Lần đầu tiên bắt đầu stream → tạo mới
        const res = await createStreamAction({
          title,
          categoryId: category,
          tagIds: tags.split(",").map((tag) => tag.trim()),
          thumbnailUrl,
        });

        // setStreamId(res.id);
      } else {
        // Đã có stream → cập nhật trạng thái live/offline
        await updateStreamAction(streamId, {
          status: isStreaming ? "offline" : "live",
        });
      }

      // setIsStreaming(!isStreaming);
    } catch (err) {
      console.error("Toggle stream failed:", err);
    }
  };

  const handleUpdateStreamInfo = async () => {
    try {
      if (!streamId) {
        alert("You need to start a stream first.");
        return;
      }

      await updateStreamAction(streamId, {
        title,
        thumbnailUrl,
      });

      alert("Stream info updated.");
    } catch (err) {
      console.error("Update stream info failed:", err);
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        } bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 text-white shadow-lg flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          <span
            className={`text-xl font-bold transition-opacity duration-300 ${
              sidebarOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            Streamer
          </span>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white focus:outline-none"
          >
            {sidebarOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>
        <ul className="flex-1 space-y-2 px-2">
          <li
            className={`flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white/10 transition ${
              activeTab === "dashboard" ? "bg-white/20 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && (
              <span className="whitespace-nowrap">Dashboard</span>
            )}
          </li>
          <li
            className={`flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-white/10 transition ${
              activeTab === "settings" ? "bg-white/20 font-semibold" : ""
            }`}
            onClick={() => setActiveTab("settings")}
          >
            <Settings size={20} />
            {sidebarOpen && <span className="whitespace-nowrap">Settings</span>}
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {activeTab === "dashboard" ? (
          <>
            <h1 className="text-2xl font-semibold mb-6">Live Stream Setup</h1>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Stream Info */}
              <div className="bg-white shadow rounded-2xl p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Stream URL{" "}
                    <span className="text-gray-400 text-xs">
                      (Use this in OBS Settings → Stream → Server)
                    </span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                      value={streamUrl}
                      readOnly
                    />
                    <button
                      onClick={() => handleCopy(streamUrl)}
                      className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Stream Key{" "}
                    <span className="text-gray-400 text-xs">
                      (Use this in OBS Settings → Stream → Key)
                    </span>
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type={showKey ? "text" : "password"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                      value={streamKey}
                      readOnly
                    />
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                    >
                      {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => handleCopy(streamKey)}
                      className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stream Settings */}
              <div className="bg-white shadow rounded-2xl p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Stream Title
                  </label>
                  <input
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                    placeholder="e.g., Playing Valorant with friends"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    <option value="Gaming">Gaming</option>
                    <option value="IRL">IRL</option>
                    <option value="Podcast">Podcast</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">Tags</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                    placeholder="Comma separated tags, e.g., FPS, Vietnam, Chill"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Thumbnail URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                    placeholder="https://example.com/thumbnail.jpg"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleStreamToggle}
                disabled={!title || !category}
                className={`px-6 py-3 text-white font-medium rounded-xl transition-colors duration-200 ${
                  isStreaming
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isStreaming ? (
                  <>
                    <StopCircle className="inline-block mr-2" size={16} /> Stop
                    Streaming
                  </>
                ) : (
                  <>
                    <Play className="inline-block mr-2" size={16} /> Start
                    Streaming
                  </>
                )}
              </button>

              <button
                onClick={handleUpdateStreamInfo}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl"
              >
                Save Stream Info
              </button>
            </div>
          </>
        ) : (
          <></>
          // <div className="bg-white shadow rounded-2xl p-6">
          //   <h2 className="text-xl font-semibold mb-4">Channel Settings</h2>
          //   <div className="space-y-4">
          //     <div>
          //       <label className="block text-sm font-medium">
          //         Channel Name
          //       </label>
          //       <input
          //         className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          //         placeholder="Your channel name"
          //       />
          //     </div>
          //     <div>
          //       <label className="block text-sm font-medium">Channel Bio</label>
          //       <textarea
          //         className="w-full px-4 py-2 border border-gray-300 rounded-xl resize-none"
          //         placeholder="Write something about your channel"
          //       />
          //     </div>
          //     <div>
          //       <label className="block text-sm font-medium">
          //         Profile Picture URL
          //       </label>
          //       <input
          //         className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          //         placeholder="https://example.com/avatar.jpg"
          //       />
          //     </div>
          //     <div>
          //       <label className="block text-sm font-medium">
          //         Banner Image URL
          //       </label>
          //       <input
          //         className="w-full px-4 py-2 border border-gray-300 rounded-xl"
          //         placeholder="https://example.com/banner.jpg"
          //       />
          //     </div>
          //   </div>
          //   <div className="mt-6">
          //     <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl">
          //       Save Settings
          //     </button>
          //   </div>
          // </div>
        )}
      </main>
    </div>
  );
}
