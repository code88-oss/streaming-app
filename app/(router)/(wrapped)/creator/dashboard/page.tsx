"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
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
  X,
} from "lucide-react";
import {
  createStreamAction,
  updateStreamAction,
  getCategoriesAction,
  getTagsAction,
} from "@/app/actions/streaming";
import useUserFromCookie from "@/app/presentation/hooks/useUserFromCookie";
import useSocket from "@/app/presentation/hooks/useSocket";
import { v4 as uuidv4 } from "uuid";
import { useSessionId } from "@/app/presentation/hooks/useSessionId";

interface StreamFormData {
  title: string;
  categoryId: string;
  tagIds: string[];
  thumbnailUrl: string;
}

interface SettingsFormData {
  channelName: string;
  channelBio: string;
  profilePictureUrl: string;
  bannerImageUrl: string;
}

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

const STREAM_URL = "rtmp://18.143.77.84:1935/live";

const CreatorDashboard: React.FC = () => {
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "settings">(
    "dashboard"
  );
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [streamId, setStreamId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(true);
  const [isLoadingTags, setIsLoadingTags] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState<string>("");
  const [showTagDropdown, setShowTagDropdown] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const { user, isLoading: isUserLoading } = useUserFromCookie();
  const [streamKey, setStreamKey] = useState("testkey");
  const socket = useSocket("/streams", user?.sub);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<StreamFormData>({
    defaultValues: {
      title: "",
      categoryId: "",
      tagIds: [],
      thumbnailUrl: "",
    },
    mode: "onChange",
  });

  const settingsForm = useForm<SettingsFormData>({
    defaultValues: {
      channelName: "",
      channelBio: "",
      profilePictureUrl: "",
      bannerImageUrl: "",
    },
    mode: "onChange",
  });

  const selectedTagIds = watch("tagIds");

  useEffect(() => {
    if (!socket || !user?.sub) return;

    const handleStreamStatus = ({
      streamId,
      status,
      message,
    }: {
      streamId: string;
      status: string;
      message: string;
    }) => {
      console.log("Received streamStatus:", { streamId, status, message });
      setStreamId(streamId);
      setIsStreaming(status === "live");
      if (message) setError(message);
    };

    socket.on("streamStatus", handleStreamStatus);

    // Khi reload trang, tự fetch status ban đầu từ Server Action
    const fetchInitialStatus = async () => {
      try {
        const res = await fetch("/api/stream", { cache: "no-store" });
        const data = await res.json();
        if (data?.streamId) {
          setStreamId(data.streamId);
          setIsStreaming(data.status === "live");
          if (data.message) setError(data.message);
        }
      } catch (err) {
        console.error("Error fetching initial stream status", err);
      }
    };

    fetchInitialStatus();

    return () => {
      socket.off("streamStatus", handleStreamStatus);
    };
  }, [socket, user]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        const data = await getCategoriesAction();
        setCategories(data);
      } catch (err: any) {
        console.error("Error fetching categories:", err);
        setError(err.message || "Failed to load categories");
      } finally {
        setIsLoadingCategories(false);
      }
    };

    const fetchTags = async () => {
      try {
        setIsLoadingTags(true);
        const data = await getTagsAction();
        setTags(data);
      } catch (err: any) {
        console.error("Error fetching tags:", err);
        setError(err.message || "Failed to load tags");
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchCategories();
    fetchTags();
  }, []);

  const filteredTags = tags.filter(
    (tag) =>
      tag.name.toLowerCase().includes(tagInput.toLowerCase()) &&
      !selectedTagIds.includes(tag.id)
  );

  const addTag = (tag: Tag) => {
    setValue("tagIds", [...selectedTagIds, tag.id]);
    setTagInput("");
    setShowTagDropdown(false);
    tagInputRef.current?.focus();
  };

  const removeTag = (tagId: string) => {
    setValue(
      "tagIds",
      selectedTagIds.filter((id) => id !== tagId)
    );
  };

  const handleTagInputFocus = () => {
    setShowTagDropdown(true);
  };

  const handleTagInputBlur = () => {
    setTimeout(() => setShowTagDropdown(false), 200);
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filteredTags.length > 0) {
      e.preventDefault();
      addTag(filteredTags[0]);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  };

  const onStreamToggle = async (data: StreamFormData) => {
    if (isActionLoading || !user) return;
    setIsActionLoading(true);
    try {
      setError(null);
      if (!streamId) {
        const res = await createStreamAction({
          title: data.title || "Untitled Stream",
          categoryId: data.categoryId || categories[0]?.id || "",
          tagIds: data.tagIds || [],
          thumbnailUrl: data.thumbnailUrl || "",
          streamUrl: STREAM_URL,
          streamKey: streamKey,
        });
        setStreamId(res.id);
      } else {
        await updateStreamAction(streamId, {
          status: isStreaming ? "offline" : "live",
        });
        setIsStreaming(false);
      }
    } catch (err: any) {
      console.error("Toggle stream failed:", err);
      setError(err.message || "Failed to toggle stream");
    } finally {
      setIsActionLoading(false);
    }
  };

  const onStreamInfoSubmit = async (data: StreamFormData) => {
    if (!streamId || !user) {
      setError("You must start the stream first");
      return;
    }
    if (isActionLoading) return;
    setIsActionLoading(true);
    try {
      setError(null);
      await updateStreamAction(streamId, {
        title: data.title,
        thumbnailUrl: data.thumbnailUrl,
      });
      alert("Stream info updated");
    } catch (err: any) {
      console.error("Failed to update stream info:", err);
      setError(err.message || "Failed to update stream info");
    } finally {
      setIsActionLoading(false);
    }
  };

  const onSettingsSubmit = async (data: SettingsFormData) => {
    if (isActionLoading || !user) return;
    setIsActionLoading(true);
    try {
      setError(null);
      alert("Settings saved successfully");
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      setError(err.message || "Failed to save settings");
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <aside
        className={`flex flex-col bg-gradient-to-r from-purple-700 to-blue-500 text-white shadow-lg transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-16"
        }`}
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
            className="text-white hover:text-gray-200"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
            )}
          </button>
        </div>
        <nav className="flex-1 px-2 space-y-2">
          {[
            {
              id: "dashboard" as const,
              label: "Dashboard",
              icon: LayoutDashboard,
            },
            { id: "settings" as const, label: "Settings", icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 p-2 rounded w-full text-left transition-colors ${
                activeTab === id
                  ? "bg-white/20 font-semibold"
                  : "hover:bg-white/10"
              }`}
              aria-label={`Switch to ${label}`}
            >
              <Icon size={20} />
              {sidebarOpen && (
                <span className="whitespace-nowrap">{label}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-xl">
            {error}
          </div>
        )}
        {activeTab === "dashboard" ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Live Stream Setup</h1>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white shadow rounded-2xl p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stream URL{" "}
                    <span className="text-xs text-gray-400">
                      (OBS Settings → Stream → Server)
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50"
                      value={STREAM_URL}
                      readOnly
                      aria-label="Stream URL"
                    />
                    <button
                      onClick={() => copyToClipboard(STREAM_URL)}
                      className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                      aria-label="Copy Stream URL"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stream Key{" "}
                    <span className="text-xs text-gray-400">
                      (OBS Settings → Stream → Key)
                    </span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={showKey ? "text" : "password"}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-gray-50"
                      value={streamKey}
                      readOnly
                      aria-label="Stream Key"
                    />
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                      aria-label={
                        showKey ? "Hide Stream Key" : "Show Stream Key"
                      }
                    >
                      {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => copyToClipboard(streamKey)}
                      className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                      aria-label="Copy Stream Key"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <form className="bg-white shadow rounded-2xl p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Stream Title
                  </label>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className={`w-full px-4 py-2 border rounded-xl ${
                          errors.title ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g., Playing Valorant with friends"
                        aria-invalid={!!errors.title}
                      />
                    )}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  {isLoadingCategories ? (
                    <p className="text-gray-500">Loading categories...</p>
                  ) : (
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-4 py-2 border rounded-xl ${
                            errors.categoryId
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                          aria-invalid={!!errors.categoryId}
                        >
                          <option value="">Select a category</option>
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  )}
                  {errors.categoryId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.categoryId.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  {isLoadingTags ? (
                    <p className="text-gray-500">Loading tags...</p>
                  ) : (
                    <Controller
                      name="tagIds"
                      control={control}
                      render={({ field }) => (
                        <div className="relative">
                          <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-xl bg-white">
                            {selectedTagIds.map((tagId) => {
                              const tag = tags.find((t) => t.id === tagId);
                              return tag ? (
                                <span
                                  key={tagId}
                                  className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                                >
                                  {tag.name}
                                  <button
                                    type="button"
                                    onClick={() => removeTag(tagId)}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                    aria-label={`Remove ${tag.name}`}
                                  >
                                    <X size={14} />
                                  </button>
                                </span>
                              ) : null;
                            })}
                            <input
                              ref={tagInputRef}
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onFocus={handleTagInputFocus}
                              onBlur={handleTagInputBlur}
                              onKeyDown={handleTagInputKeyDown}
                              className="flex-1 min-w-[100px] px-2 py-1 border-none outline-none"
                              placeholder={
                                selectedTagIds.length
                                  ? ""
                                  : "Type to search tags..."
                              }
                              aria-label="Search tags"
                            />
                          </div>
                          {showTagDropdown && filteredTags.length > 0 && (
                            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                              {filteredTags.map((tag) => (
                                <li
                                  key={tag.id}
                                  onClick={() => addTag(tag)}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                                  role="option"
                                  aria-selected={selectedTagIds.includes(
                                    tag.id
                                  )}
                                >
                                  {tag.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    />
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Type to search and add tags
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thumbnail URL
                  </label>
                  <Controller
                    name="thumbnailUrl"
                    control={control}
                    rules={{
                      pattern: {
                        value: /^https?:\/\/.+/,
                        message: "Please enter a valid URL",
                      },
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="url"
                        className={`w-full px-4 py-2 border rounded-xl ${
                          errors.thumbnailUrl
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="https://example.com/thumbnail.jpg"
                        aria-invalid={!!errors.thumbnailUrl}
                      />
                    )}
                  />
                  {errors.thumbnailUrl && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.thumbnailUrl.message}
                    </p>
                  )}
                </div>
              </form>
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={handleSubmit(onStreamToggle)}
                disabled={isActionLoading || !user || isUserLoading}
                className={`px-6 py-3 text-white font-medium rounded-full transition-colors ${
                  isStreaming
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label={isStreaming ? "Stop Streaming" : "Start Streaming"}
              >
                {isActionLoading ? (
                  "Processing..."
                ) : isStreaming ? (
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
                onClick={handleSubmit(onStreamInfoSubmit)}
                disabled={
                  !streamId || isActionLoading || !user || isUserLoading
                }
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Save Stream Info"
              >
                Save Stream Info
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={settingsForm.handleSubmit(onSettingsSubmit)}
            className="bg-white shadow rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Channel Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Channel Name
                </label>
                <Controller
                  name="channelName"
                  control={settingsForm.control}
                  rules={{ required: "Channel name is required" }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className={`w-full px-4 py-2 border rounded-xl ${
                        settingsForm.formState.errors.channelName
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Your channel name"
                      aria-invalid={!!settingsForm.formState.errors.channelName}
                    />
                  )}
                />
                {settingsForm.formState.errors.channelName && (
                  <p className="text-red-500 text-xs mt-1">
                    {settingsForm.formState.errors.channelName.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Channel Bio
                </label>
                <Controller
                  name="channelBio"
                  control={settingsForm.control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl resize-none"
                      placeholder="Write something about your channel"
                      rows={4}
                    />
                  )}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Picture URL
                </label>
                <Controller
                  name="profilePictureUrl"
                  control={settingsForm.control}
                  rules={{
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Please enter a valid URL",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className={`w-full px-4 py-2 border rounded-xl ${
                        settingsForm.formState.errors.profilePictureUrl
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="https://example.com/avatar.jpg"
                      aria-invalid={
                        !!settingsForm.formState.errors.profilePictureUrl
                      }
                    />
                  )}
                />
                {settingsForm.formState.errors.profilePictureUrl && (
                  <p className="text-red-500 text-xs mt-1">
                    {settingsForm.formState.errors.profilePictureUrl.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Banner Image URL
                </label>
                <Controller
                  name="bannerImageUrl"
                  control={settingsForm.control}
                  rules={{
                    pattern: {
                      value: /^https?:\/\/.+/,
                      message: "Please enter a valid URL",
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      className={`w-full px-4 py-2 border rounded-xl ${
                        settingsForm.formState.errors.bannerImageUrl
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="https://example.com/banner.jpg"
                      aria-invalid={
                        !!settingsForm.formState.errors.bannerImageUrl
                      }
                    />
                  )}
                />
                {settingsForm.formState.errors.bannerImageUrl && (
                  <p className="text-red-500 text-xs mt-1">
                    {settingsForm.formState.errors.bannerImageUrl.message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-6">
              <button
                type="submit"
                disabled={isActionLoading || !user || isUserLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Save Settings"
              >
                Save Settings
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default CreatorDashboard;
