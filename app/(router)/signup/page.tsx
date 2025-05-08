import SignUpForm from "@/app/presentation/components/signup-form";
import SocialLoginButtons from "@/app/presentation/components/social-login-buttons";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-[#1f1f23] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 sm:mb-6">
          Sign Up for Twitch
        </h1>

        <SignUpForm />

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-400 text-sm sm:text-base">or sign up with</p>
          <SocialLoginButtons />
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            Already have an account?{" "}
            <Link href="/login" className="text-[#9147ff] hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
