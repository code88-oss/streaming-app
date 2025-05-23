"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { Moon, MoonStar, SearchIcon, User as UserIcon } from "lucide-react";
import useUserFromCookie from "../hooks/useUserFromCookie";

export default function Header() {
  const user = useUserFromCookie();
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = "auth_token=; Max-Age=0; path=/";
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 py-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <MoonStar size={36} className="text-white" />
          <span className="text-white text-xl font-bold">Ocean Studio</span>
        </Link>

        {/* Search: only for desktop */}
        <div className="hidden sm:flex flex-1 mx-4 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-lg bg-[#1f1f23] px-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <nav className="flex items-center space-x-4">
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2 rounded-lg px-3 py-2 hover:bg-[#33333a] transition-colors">
                <UserIcon size={20} className="text-white" />
                <span className="text-sm text-white">{user.username}</span>
              </button>

              <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity absolute right-0 mt-2 w-48 bg-[#2a2a2e] text-white rounded-lg shadow-xl z-20">
                <div className="p-3 border-b border-[#3f3f46]">
                  <p className="text-sm font-semibold">{user.username}</p>
                  <p className="text-xs truncate text-gray-400">{user.email}</p>
                </div>
                <ul className="py-1">
                  <li>
                    <Link
                      href="/creator/dashboard"
                      className="block px-4 py-2 text-sm hover:bg-[#33333a] rounded-md transition-colors"
                    >
                      Creator Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm hover:bg-[#33333a] rounded-md transition-colors"
                    >
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                className="rounded-lg border border-indigo-600 px-4 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
