"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfilePage({ params }: any) {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = params.id;
  const currentUser = session?.user?.id;

  const [followers, setFollowers] = useState(0);

  async function toggleFollow() {
    if (!session) {
      router.push('/lab2/login');
      return;
    }

    if (!currentUser) {
      alert('Please login to follow users');
      return;
    }

    await fetch("/api/lab9/follow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        followerId: currentUser,
        followingId: userId,
      }),
    });
    
    const res = await fetch(`/api/lab9/followers/${userId}`);
    const data = await res.json();
    setFollowers(data.followers);
  }

  useEffect(() => {
    const loadFollowers = async () => {
      const res = await fetch(`/api/lab9/followers/${userId}`);
      const data = await res.json();
      setFollowers(data.followers);
    };
    
    loadFollowers();
  }, [userId]);

  if (!session) {
    return (
      <div className="p-4">
        <p className="text-black mb-4">Please login to view profiles and follow users.</p>
        <button 
          onClick={() => router.push('/lab2/login')}
          className="border-2 border-black bg-transparent text-black px-4 py-2 rounded transition-all duration-300 hover:bg-black hover:text-white hover:scale-105"
        >
          Login
        </button>
      </div>
    );
  }

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