"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b-2 border-black font-sans">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-black font-sans">
          Medium
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/" className="text-black hover:text-black">
            Home
          </Link>
          <Link href="/lab3/editor" className="text-black hover:text-black">
            Write
          </Link>
          <Link href="/lab4/posts" className="text-black hover:text-black">
            Posts
          </Link>
          <Link href="/lab5" className="text-black hover:text-black">
            Feed
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/lab2/login" className="text-black hover:text-black">
              Login
            </Link>
            <Link href="/lab2/signup" className="text-black hover:text-black">
              Sign Up
            </Link>
            {session && (
              <Link href="/lab2/profile" className="text-black hover:text-black">
                Profile
              </Link>
            )}
            <button
              onClick={() => signOut()}
              className="border-2 border-black bg-transparent text-black px-4 py-2 rounded transition-all duration-300 hover:bg-black hover:text-white hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}