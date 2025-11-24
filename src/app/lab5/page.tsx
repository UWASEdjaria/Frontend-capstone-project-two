/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import CategoryFilter from "@/components/CategoryFilter";

export default function Feed() {
  const [search, setSearch] = useState(""); // Search input
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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

  // Filter posts based on search term and category
  useEffect(() => {
    let filtered = allPosts;

    // Filter by category first
    if (selectedCategory) {
      filtered = filtered.filter(post =>
        post.tags?.some((tag: any) => tag.name === selectedCategory)
      );
    }

    // Then filter by search term
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(post =>
        post.title?.toLowerCase().includes(searchLower) ||
        post.content?.toLowerCase().includes(searchLower) ||
        post.author?.name?.toLowerCase().includes(searchLower) ||
        post.tags?.some((tag: any) => tag.name?.toLowerCase().includes(searchLower))
      );
    }

    setPosts(filtered);
  }, [search, selectedCategory, allPosts]);

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
          <div className="relative">
            <input
              placeholder="Search posts by title, content, author, or tags..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-3 border-2 border-black rounded text-black transition-all duration-300 focus:shadow-md focus:scale-105 pr-10"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter 
          onCategorySelect={setSelectedCategory}
          selectedCategory={selectedCategory}
        />

        {/* Search/Filter Results Info */}
        {(search || selectedCategory) && (
          <div className="bg-white/70 backdrop-blur-sm rounded-lg p-3 mb-4 shadow-lg">
            <p className="text-black">
              {posts.length > 0 ? (
                `Found ${posts.length} post(s)${search ? ` for "${search}"` : ''}${selectedCategory ? ` in "${selectedCategory}"` : ''}`
              ) : (
                `No posts found${search ? ` for "${search}"` : ''}${selectedCategory ? ` in "${selectedCategory}"` : ''}`
              )}
            </p>
            {(search || selectedCategory) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory(null);
                }}
                className="text-sm text-blue-600 hover:text-blue-800 mt-1"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Posts list */}
        <div className="flex flex-col gap-4">
          {posts.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 text-center shadow-lg">
              <p className="text-black text-lg">
                {search ? "No posts match your search." : "No posts available."}
              </p>
              {!search && (
                <Link href="/lab3/editor" className="text-blue-600 hover:underline mt-2 inline-block">
                  Create the first post!
                </Link>
              )}
            </div>
          ) : (
            posts.map((p) => (
              <Link
                key={p.id}
                href={`/lab4/posts/${p.id}`}
                className="p-4 border-2 border-black rounded hover:bg-white/90 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105"
              >
                <h2 className="text-xl font-bold text-black">{p.title}</h2>
                <p className="text-black">By {p.author?.name || "Unknown"}</p>
                {p.tags && p.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {p.tags.map((tag: any) => (
                      <span key={tag.id} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                )}
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
