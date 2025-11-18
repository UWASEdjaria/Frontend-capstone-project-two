"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch("/api/lab4/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      alert("Post published successfully!");
      router.push("/lab4/posts");
    } else {
      alert("Failed to publish post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      
      <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded">
        <p className="text-orange-700 mb-2">For rich text editing with fonts and formatting:</p>
        <Link href="/lab3/editor" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600">
          Use Rich Text Editor
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <textarea
          placeholder="Post Content (Plain Text)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-3 border rounded h-40"
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            Publish Post
          </button>
          <Link href="/lab3/editor" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600">
            Rich Editor
          </Link>
        </div>
      </form>
    </div>
  );
}