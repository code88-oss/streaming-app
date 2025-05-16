import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-500 py-6">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-200">
        <p className="mt-2 text-gray-300">
          &copy; 2025 Ocean Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
