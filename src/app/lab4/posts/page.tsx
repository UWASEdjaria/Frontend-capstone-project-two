"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  useEffect(() => { fetch("/lab4/api/post").then(r => r.json()).then(setPosts) }, []);
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-[#ff4d6d] mb-4">Posts</h1>
      {posts.map(p => (
        <Link key={p.id} href={`/lab4/posts/${p.slug || p.id}`} className="block p-4 mb-2 border rounded bg-white">{p.title} - {p.author.name}</Link>
      ))}
    </div>
  );
}
