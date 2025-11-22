"use client";

import { useEffect, useState } from "react";

export default function PostLike({ params }: { params: { id: string } }) {
  const postId = Number(params.id);
  const userId = 1; // TEMP fake user — replace with real auth later

  const [likes, setLikes] = useState(0);

  async function loadLikes() {
    const res = await fetch(`/api/lab8/likes/${postId}`);
    const data = await res.json();
    setLikes(data.likes);
  }

  async function toggleLike() {
    await fetch("/api/lab8/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, userId }),
    });
    loadLikes();
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    loadLikes();
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={toggleLike}
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        👍 Like ({likes})
      </button>
    </div>
  );
}