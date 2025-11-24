"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProfilePageProps {
  params: { id: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const userId = params.id;
  const currentUserEmail = session?.user?.email;

  const [followers, setFollowers] = useState<number>(0);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  async function toggleFollow() {
    if (!session || !currentUserEmail) {
      router.push('/lab2/login');
      return;
    }

    try {
      const res = await fetch("/api/lab9/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserEmail,
          targetUserId: userId,
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
        setFollowers(data.followersCount);
      }
    } catch (error) {
      console.error('Follow error:', error);
    }
  }

  useEffect(() => {
    const loadFollowData = async () => {
      if (!currentUserEmail) return;
      
      try {
        const res = await fetch(`/api/lab9/followers/${userId}?currentUser=${encodeURIComponent(currentUserEmail)}`);
        const data = await res.json();
        setFollowers(data.followers);
        setIsFollowing(data.isFollowing || false);
      } catch (error) {
        console.error('Load follow data error:', error);
      }
    };
    
    loadFollowData();
  }, [userId, currentUserEmail]);

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
        {isFollowing ? 'Unfollow' : 'Follow'} ({followers})
      </button>
    </div>
  );
}