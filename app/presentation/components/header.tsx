import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#2a2a2e] py-3 shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4">
        <Link href="/">
          <Image src="/logo/twitch.png" alt="Twitch" width={50} height={50} />
        </Link>
        <div className="flex-1 mx-4 max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full rounded-md bg-[#3f3f46] px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#9147ff]"
          />
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            href="/login"
            className="rounded-md bg-[#9147ff] px-4 py-2 text-sm font-medium text-white hover:bg-[#7a3dd1]"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="rounded-md border border-[#9147ff] px-4 py-2 text-sm font-medium text-[#9147ff] hover:bg-[#9147ff] hover:text-white"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}
