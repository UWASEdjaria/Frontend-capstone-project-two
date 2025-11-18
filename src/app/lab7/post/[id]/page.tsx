"use client";
import { useState, useEffect } from "react";

export default function PostPage({ params }: any) {
  const id = params.id;
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  async function load() {
    const res = await fetch(`/api/lab7/comments/${id}`);
    setComments(await res.json());
  }

  async function add() {
    await fetch("/api/lab7/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id, text }),
    });
    setText("");
    load();
  }

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3 text-orange-500">Comments</h1>

      <input
        className="border p-2 w-full"
        placeholder="Write comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="bg-orange-500 text-white p-2 mt-2 rounded"
        onClick={add}
      >
        Add
      </button>

      <div className="mt-4">
        {comments.map((c: any) => (
          <div key={c.id} className="border p-2 mb-2 rounded">
            {c.text}
          </div>
        ))}
      </div>
    </div>
  );
}