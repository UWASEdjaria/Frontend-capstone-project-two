"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-white shadow-md border-b">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-orange-500">
          DjariaBlog
        </Link>
        
        <div className="flex items-center gap-6">
          <Link href="/lab3/editor" className="text-gray-600 hover:text-orange-500">
            Write
          </Link>
          <Link href="/lab4/posts" className="text-gray-600 hover:text-orange-500">
            Posts
          </Link>
          <Link href="/lab5" className="text-gray-600 hover:text-orange-500">
            Feed
          </Link>
          
          {session ? (
            <div className="flex items-center gap-4">
              <Link href="/lab2/profile" className="text-gray-600 hover:text-orange-500">
                Profile
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/lab2/login" className="text-orange-500 hover:underline">
                Login
              </Link>
              <Link href="/lab2/signup" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}