"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  SignUpRequest,
  SignUpUseCase,
} from "@/app/domain/use-cases/signup-use-case";
import { MockAuthService } from "@/app/infrastructure/auth/auth-service";

// Định nghĩa Zod schema cho form
const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username is too long"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password is too long"),
    confirmPassword: z.string().min(6, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// TypeScript type từ schema
type SignUpFormData = z.infer<typeof signUpSchema>;

// Khởi tạo use case
const signUpUseCase = new SignUpUseCase(new MockAuthService());

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const request: SignUpRequest = {
        username: data.username,
        email: data.email,
        password: data.password,
      };
      const response = await signUpUseCase.execute(request);
      console.log("Sign up successful:", response);
    } catch (err: any) {
      setError("root", {
        type: "manual",
        message: err.message || "Registration failed",
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
          htmlFor="email"
          className="block text-sm sm:text-base font-medium text-gray-300"
        >
          Email
        </label>
        <input
          id="email"
          {...register("email")}
          placeholder="Enter your email"
          className="mt-1 w-full p-2 sm:p-3 bg-[#2a2a2e] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#9147ff] text-sm sm:text-base"
        />
        {errors.email && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">
            {errors.email.message}
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

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm sm:text-base font-medium text-gray-300"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          placeholder="Confirm your password"
          className="mt-1 w-full p-2 sm:p-3 bg-[#2a2a2e] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#9147ff] text-sm sm:text-base"
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs sm:text-sm mt-1">
            {errors.confirmPassword.message}
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
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  );
}
