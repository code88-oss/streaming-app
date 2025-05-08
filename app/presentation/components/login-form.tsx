"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  LoginUseCase,
  LoginRequest,
} from "@/app/domain/use-cases/login-use-case";
import { MockAuthService } from "@/app/infrastructure/auth/auth-service";

// Định nghĩa Zod schema cho form
const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(100, "Username is too long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

// TypeScript type từ schema
type LoginFormData = z.infer<typeof loginSchema>;

// Khởi tạo use case
const loginUseCase = new LoginUseCase(new MockAuthService());

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const request: LoginRequest = {
        username: data.username,
        password: data.password,
      };
      const response = await loginUseCase.execute(request);
      console.log("Login successful:", response);
    } catch (err: any) {
      setError("root", {
        type: "manual",
        message: err.message || "Invalid credentials",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-sm sm:text-base font-medium text-gray-300"
        >
          Username
        </label>
        <input
          id="username"
          {...register("username")}
          placeholder="Enter your username"
          className="mt-1 w-full p-2 sm:p-3 bg-[#2a2a2e] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#9147ff] text-sm sm:text-base"
        />
        {errors.username && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">
            {errors.username.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm sm:text-base font-medium text-gray-300"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          placeholder="Enter your password"
          className="mt-1 w-full p-2 sm:p-3 bg-[#2a2a2e] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#9147ff] text-sm sm:text-base"
        />
        {errors.password && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">
            {errors.password.message}
          </p>
        )}
      </div>

      {errors.root && (
        <p className="text-red-500 text-xs sm:text-sm">{errors.root.message}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#9147ff] text-white py-2 sm:py-3 rounded-md hover:bg-[#7a3dd1] transition-colors disabled:opacity-50 text-sm sm:text-base"
      >
        {isSubmitting ? "Logging in..." : "Log In"}
      </button>
    </form>
  );
}
