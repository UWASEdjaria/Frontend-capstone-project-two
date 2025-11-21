"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Feed() {
  const [search, setSearch] = useState(""); // Search input
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [posts, setPosts] = useState<any[]>([]); // Filtered posts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [allPosts, setAllPosts] = useState<any[]>([]); // All posts from backend

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/lab4/post");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setAllPosts(data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Fetch posts once when component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts based on search term
  useEffect(() => {
    if (!search) {
      setPosts(allPosts);
    } else {
      const filtered = allPosts.filter(post =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.content.toLowerCase().includes(search.toLowerCase())
      );
      setPosts(filtered);
    }
  }, [search, allPosts]);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="max-w-5xl mx-auto pt-10 p-4">
        {/* Header */}
        <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-6 shadow-lg">
          <h1 className="text-3xl font-bold text-black mb-4">Home Feed</h1>
          <input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="p-2 border-2 border-black rounded flex-1 text-black transition-all duration-300 focus:shadow-md focus:scale-105"
          />
        </div>

        {/* Posts list */}
        <div className="flex flex-col gap-4">
          {posts.length === 0 ? (
            <p className="text-black">No posts found.</p>
          ) : (
            posts.map((p) => (
              <Link
                key={p.id}
                href={`/lab4/posts/${p.id}`}
                className="p-4 border-2 border-black rounded hover:bg-white/90 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105"
              >
                <h2 className="text-xl font-bold text-black">{p.title}</h2>
                <p className="text-black">By {p.author?.name || "Unknown"}</p>
                <div className="flex gap-4 mt-2 text-sm text-black">
                  <span>❤️ {p._count?.likes || 0}</span>
                  <span>💬 {p._count?.comments || 0}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
