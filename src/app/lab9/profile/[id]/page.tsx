"use client";

import { useEffect, useState } from "react";

export default function ProfilePage({ params }: any) {
  const userId = Number(params.id);  // user you want to follow
  const currentUser = 1;             // TEMP user (replace with auth)

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
        className="bg-orange-500 text-white px-4 py-2 rounded"
      >
        Follow ({followers})
      </button>
    </div>
  );
}