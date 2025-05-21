export default function SocialLoginButtons() {
  return (
    <a
      href={`${process.env.NESTJS_API_URL}/auth/google`}
      className="mt-4 flex justify-center gap-4"
    >
      <button className="bg-[#ff0000] text-white px-4 py-2 rounded-md hover:bg-[#cc0000] w-full">
        Google
      </button>
    </a>
  );
}
