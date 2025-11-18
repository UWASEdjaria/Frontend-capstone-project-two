"use client";

import { useEffect, useState } from "react";

export default function ProfilePage({ params }: any) {
  const userId = Number(params.id);
  const currentUser = 1;             

  const [followers, setFollowers] = useState(0);

  async function load() {
    const res = await fetch(`/api/lab9/followers/${userId}`);
    const data = await res.json();
    setFollowers(data.followers);
  }

  async function toggleFollow() {
    await fetch("/api/lab9/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        followerId: currentUser,
        followingId: userId,
      }),
    });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={toggleFollow}
        className="border-2 border-black bg-transparent text-black px-4 py-2 rounded transition-all duration-300 hover:bg-black hover:text-white hover:scale-105"
      >
        Follow ({followers})
      </button>
    </div>
  );
}