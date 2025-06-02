import { useEffect } from "react";

export default function SocialLoginButtons() {
  // Hàm gọi API để lấy profile
  const fetchUserProfile = async () => {
    try {
      const response = await fetch(
        `${process.env.NESTJS_API_URL}/auth/google`,
        {
          method: "GET",
          credentials: "include", // Gửi cookie
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log("User Profile:", data);
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  // Gọi API khi component mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <a
      href={`${process.env.HOST_API_URL}/auth/google`}
      className="mt-4 flex justify-center gap-4"
    >
      <button className="bg-[#ff0000] text-white px-4 py-2 rounded-md hover:bg-[#cc0000] w-full">
        Google
      </button>
    </a>
  );
}
