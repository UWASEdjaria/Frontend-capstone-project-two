"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch("/api/lab4/post")
      .then(r => r.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div className="max-w-4xl mx-auto mt-10">Loading...</div>;
  
  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-purple-600 mb-4">Posts</h1>
      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet. <Link href="/lab4/create" className="text-purple-600 hover:underline">Create one!</Link></p>
      ) : (
        posts.map(p => (
          <div key={p.id} className="p-4 mb-4 border rounded bg-white">
            <Link href={`/lab4/posts/${p.id}`} className="text-xl font-bold text-purple-600 hover:underline">
              {p.title}
            </Link>
            <p className="text-gray-600 mt-2">By {p.author?.name || 'Unknown'}</p>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>❤️ {p.likes?.length || 0} likes</span>
              <span>💬 {p.comments?.length || 0} comments</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}