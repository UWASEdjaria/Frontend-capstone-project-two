"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Feed() {
  const [search, setSearch] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/lab4/post");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAllPosts(data);
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
    <div className="max-w-5xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-black mb-4">Home Feed</h1>

      <div className="flex gap-2 mb-6">
        <input 
          placeholder="Search posts..." 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          className="p-2 border-2 border-black rounded flex-1 text-black transition-all duration-300 focus:shadow-md focus:scale-105" 
        />
      </div>

      <div className="flex flex-col gap-4">
        {posts.length === 0 ? (
          <p className="text-black">No posts found.</p>
        ) : (
          posts.map(p => (
            <Link key={p.id} href={`/lab4/posts/${p.id}`} className="p-4 border-2 border-black rounded hover:bg-gray-50 bg-white transition-all duration-300 hover:scale-105">
              <h2 className="text-xl font-bold text-black">{p.title}</h2>
              <p className="text-black">By {p.author?.name || 'Unknown'}</p>
              <div className="flex gap-4 mt-2 text-sm text-black">
                <span>❤️ {p.likes?.length || 0}</span>
                <span>💬 {p.comments?.length || 0}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}