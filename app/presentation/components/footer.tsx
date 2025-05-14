import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#2a2a2e] py-6">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-400">
        <p>
          <Link href="/about" className="hover:text-[#9147ff]">
            About
          </Link>{" "}
          |{" "}
          <Link href="/help" className="hover:text-[#9147ff]">
            Help
          </Link>{" "}
          |{" "}
          <Link href="/terms" className="hover:text-[#9147ff]">
            Terms
          </Link>{" "}
          |{" "}
          <Link href="/privacy" className="hover:text-[#9147ff]">
            Privacy
          </Link>
        </p>
        <p className="mt-2">&copy; 2025 Bear. All rights reserved.</p>
      </div>
    </footer>
  );
}
