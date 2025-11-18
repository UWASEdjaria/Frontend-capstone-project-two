"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-md border-b font-sans">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-slate-800 font-sans">
          Medium Write
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/lab3/editor" className="text-gray-600 hover:text-slate-800">
            Write
          </Link>
          <Link href="/lab4/posts" className="text-gray-600 hover:text-slate-800">
            Posts
          </Link>
          <Link href="/lab5" className="text-gray-600 hover:text-slate-800">
            Feed
          </Link>
          
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/lab2/profile" className="text-gray-600 hover:text-slate-800">
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/lab2/login" className="text-slate-600 hover:text-slate-800">
                Login
              </Link>
              <Link href="/lab2/signup" className="bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}