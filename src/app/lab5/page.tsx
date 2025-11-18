"use client";
import { useState } from "react";
import { posts } from "./posts";  // Updated import path

export default function Feed() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  const filtered = posts.filter(post => 
    (!search || 
     post.title.toLowerCase().includes(search.toLowerCase()) || 
     post.content.toLowerCase().includes(search.toLowerCase())) &&
    (!selectedTag || post.tags.includes(selectedTag))
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-500">Posts</h1>
      <input
        placeholder="Search posts..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-2 mb-4 border text-gray-500 border-orange-700 rounded"
      />
      <div className="space-y-4">
        {filtered.map(post => (
          <div key={post.id} className="p-4 border rounded">
            <h2 className="text-xl font-semibold text-gray-500">{post.title}</h2>
            <p className="text-gray-600">{post.content}</p>
            <p className="text-sm text-gray-500">By {post.author}</p>
            {post.tags.length > 0 && (
              <div className="flex gap-2 mt-2">
                {post.tags.map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                    className={`px-2 py-1 text-xs border border-orange-500 rounded-lg hover:bg-orange-100 ${
                      selectedTag === tag ? "bg-orange-500 text-white" : "text-black"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}