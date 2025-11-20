"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Lab3() {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div className="min-h-screen py-8" style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-xl border-2 border-gray-300 p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-8 text-black text-center">Rich Content Editor</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/lab3/editor"
              className="block p-6 bg-white/80 border-2 border-gray-300 rounded-lg hover:bg-white transition-all shadow-lg"
            >
              <h2 className="text-xl font-semibold text-black mb-2">Rich Text Editor</h2>
              <p className="text-gray-700">Create posts with rich formatting, images, and embeds</p>
            </Link>

            <Link
              href="/lab4/posts"
              className="block p-6 bg-white/80 border-2 border-gray-300 rounded-lg hover:bg-white transition-all shadow-lg"
            >
              <h2 className="text-xl font-semibold text-black mb-2">View Posts</h2>
              <p className="text-gray-700">Browse all published posts</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
