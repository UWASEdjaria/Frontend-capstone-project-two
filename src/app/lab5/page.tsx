"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState("");

  const fetchPosts = async () => {
    try {
      let url = "/api/lab4/posts";
      if (search || tag) {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (tag) params.append('tag', tag);
        url += `?${params.toString()}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Optionally set an error state to show to the user
      // setError("Failed to load posts. Please try again later.");
    }
  };

  useEffect(() => { fetchPosts() }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-[#ff4d6d] mb-4">Home Feed</h1>

      <div className="flex gap-2 mb-6">
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
               className="p-2 border rounded flex-1" />
        <input placeholder="Tag..." value={tag} onChange={e => setTag(e.target.value)}
               className="p-2 border rounded flex-1" />
        <button onClick={fetchPosts} className="bg-[#ff4d6d] text-white px-4 rounded">Go</button>
      </div>

      <div className="flex flex-col gap-4">
        {posts.map(p => (
          <Link key={p.id} href={`/lab4/posts/${p.id}`} className="p-4 border rounded hover:shadow bg-white">
            <h2 className="text-xl font-bold text-[#ff4d6d]">{p.title}</h2>
            <p className="text-gray-700">By {p.author.name}</p>
            {p.tags?.length > 0 && (
              <p className="text-sm text-gray-500">Tags: {p.tags.map((t: any) => t.name).join(", ")}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
