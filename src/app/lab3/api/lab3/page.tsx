"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

// Jodit requires dynamic import (no SSR)
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function EditorPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!token) return setError("You must be logged in");

    const res = await fetch("/api/lab3/post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ title, content }),
    });

    const data = await res.json();
    if (!res.ok) return setError(data.error);

    alert("Post created!");
    router.push("/"); // redirect to home/feed
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h1 className="text-2xl font-bold text-[#ff4d6d] mb-4">Create a New Post</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-3 border rounded-lg bg-gray-100"
        />

        <JoditEditor
          value={content}
          onChange={(newContent) => setContent(newContent)}
        />

        <button
          type="submit"
          className="bg-[#ff4d6d] text-white p-3 rounded-lg font-bold"
        >
          Publish
        </button>
      </form>
    </div>
  );
}
