export default function SocialLoginButtons() {
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

  return (
    <div onClick={fetchUserProfile} className="mt-4 flex justify-center gap-4">
      <button className="bg-[#ff0000] text-white px-4 py-2 rounded-md hover:bg-[#cc0000] w-full">
        Google
      </button>
    </div>
  );
}
