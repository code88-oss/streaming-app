export default function SocialLoginButtons() {
  return (
    <div className="mt-4 flex justify-center gap-4">
      <button className="bg-[#3b5998] text-white px-4 py-2 rounded-md hover:bg-[#2f477a]">
        Facebook
      </button>
      <button className="bg-[#1da1f2] text-white px-4 py-2 rounded-md hover:bg-[#0d8bd9]">
        Twitter
      </button>
      <button className="bg-[#ff0000] text-white px-4 py-2 rounded-md hover:bg-[#cc0000]">
        YouTube
      </button>
    </div>
  );
}
