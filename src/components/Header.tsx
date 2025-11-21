"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b-2 border-gray-300 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Link href="/" className="text-3xl font-bold text-black">
          Medium
        </Link>
        
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="text-black hover:text-gray-600 font-medium">
            Home
          </Link>
          <Link href="/lab3/editor" className="text-black hover:text-gray-600 font-medium">
            Write
          </Link>
          <Link href="/lab4/posts" className="text-black hover:text-gray-600 font-medium">
            Posts
          </Link>

          {/* Lab3 Dashboard visible only for logged-in users */}
          {session && (
            <Link href="/lab3" className="text-black hover:text-gray-600 font-medium">
            post details
            </Link>
          )}

          <div className="flex items-center gap-4">
            {!session ? (
              <>
                <Link href="/lab2/login" className="text-black hover:text-gray-600 font-medium">
                  Login
                </Link>
                <Link href="/lab2/signup" className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 font-medium">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link href="/lab2/profile" className="text-black hover:text-gray-600 font-medium">
                  Profile
                </Link>
                <button
                  onClick={() => signOut()}
                  className="border-2 border-black text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white font-medium transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
