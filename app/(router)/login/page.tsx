import Link from "next/link";
import LoginForm from "../../presentation/components/login-form";
import SocialLoginButtons from "../../presentation/components/social-login-buttons";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-[#1f1f23] p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm sm:max-w-md lg:max-w-lg">
        <h1 className="text-2xl sm:text-3xl font-bold text-white text-center mb-4 sm:mb-6">
          Log In to <span className="text-blue-500">Ocean Studio</span>
        </h1>

        <LoginForm />

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-400 text-sm sm:text-base">or log in with</p>
          <SocialLoginButtons />
        </div>

        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-gray-400 text-sm sm:text-base">
            Don't have an account?{" "}
            <Link href="/signup" className="text-[#9147ff] hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
