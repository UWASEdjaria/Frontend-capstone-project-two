"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Profile: React.FC = () => {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);
  const [posts] = useState<{ id: string; title: string; image?: string }[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    showFollowButton: true
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setEditForm(prev => ({
        ...prev,
        name: session.user.name || ''
      }));
    }
  }, [session?.user]);

  const handleFollow = async () => {
    setIsFollowing(!isFollowing);
    setFollowingCount(prev => isFollowing ? prev - 1 : prev + 1);
  };

  const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/lab2/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.user?.email,
          name: editForm.name,
          bio: editForm.bio
        })
      });
      
      if (res.ok) {
        await update({
          ...session,
          user: {
            ...session?.user,
            name: editForm.name
          }
        });
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (status === "loading") return <div className="text-center mt-10 text-white">Loading...</div>;
  
  if (!session) {
    router.push('/lab2/login');
    return null;
  }

  const initial = session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase();

  return (
    <div className="max-w-lg mx-auto mt-10">
      {showWelcome && (
        <div className="bg-green-600 text-white p-3 rounded-md text-center mb-5 font-medium">
          👋 Welcome back, {session.user?.name || session.user?.email}!
        </div>
      )}

      <div className="flex items-center gap-6 px-4">
        <div className="bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 p-[3px] rounded-full">
          {session.user?.image ? (
            <Image src={session.user.image} alt="Profile" width={96} height={96} className="w-24 h-24 rounded-full object-cover bg-white" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-purple-600 text-white flex items-center justify-center text-4xl font-bold">
              {initial}
            </div>
          )}
        </div>

        <div className="flex-1 flex justify-between text-center text-white px-4">
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold">{posts.length}</p>
            <p className="text-sm">Posts</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold">{followersCount}</p>
            <p className="text-sm">Followers</p>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-xl font-bold">{followingCount}</p>
            <p className="text-sm">Following</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 text-white">
        <p className="font-bold text-lg">{session.user?.name || session.user?.email}</p>
        {editForm.bio && <p className="text-sm opacity-80">{editForm.bio}</p>}
      </div>

      <div className="px-4 mt-4 bg-white/10 rounded-lg p-3 mx-4">
        <p className="text-white text-sm"><span className="font-semibold">Name:</span> {session.user?.name || 'Not set'}</p>
        <p className="text-white text-sm mt-1"><span className="font-semibold">Email:</span> {session.user?.email}</p>
      </div>

      <div className="flex gap-3 mt-4 px-4">
        <button onClick={() => setShowEditModal(true)} className="flex-1 border border-white text-white rounded-md py-1 text-sm font-semibold hover:bg-white hover:text-black transition">Edit Profile</button>
        <button onClick={handleFollow} className="flex-1 bg-purple-600 text-white rounded-md py-1 text-sm font-semibold hover:bg-purple-700 transition">
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
        <button onClick={() => signOut({ callbackUrl: "/lab2/login" })} className="flex-1 border border-white text-white rounded-md py-1 text-sm font-semibold hover:bg-white hover:text-black transition">Logout</button>
      </div>

      <div className="px-4 mt-8">
        <h2 className="font-semibold text-white mb-4">Followers ({followersCount})</h2>
        <div className="bg-white/10 rounded-lg p-4 space-y-2">
          {followersCount === 0 ? (
            <p className="text-white text-sm text-center opacity-70">No followers yet</p>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-2 bg-white/5 rounded">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">U</div>
                <span className="text-white text-sm">Sample User</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 mt-6">
        <h2 className="font-semibold text-white mb-4">Following ({followingCount})</h2>
        <div className="bg-white/10 rounded-lg p-4 space-y-2">
          {followingCount === 0 ? (
            <p className="text-white text-sm text-center opacity-70">Not following anyone yet</p>
          ) : (
            <div className="space-y-2">
              {Array.from({ length: followingCount }, (_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span className="text-white text-sm">User {i + 1}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <h2 className="px-4 mt-8 font-semibold text-white">Posts</h2>
      <div className="grid grid-cols-3 gap-1 mt-3 px-1">
        {posts.length === 0 ? (
          <p className="text-white col-span-3 text-center">No posts yet</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="h-28 w-full bg-gray-700">
              {post.image ? (
                <Image src={post.image} alt={post.title} width={112} height={112} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-white font-bold text-xl">
                  {post.title?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 mx-4">
            <h3 className="text-lg font-bold mb-4 text-black">Edit Profile</h3>
            <form onSubmit={handleEditProfile}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full p-2 border rounded text-black"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full p-2 border rounded text-black h-20"
                />
              </div>
              <div className="mb-4">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    checked={editForm.showFollowButton}
                    onChange={(e) => setEditForm({...editForm, showFollowButton: e.target.checked})}
                    className="mr-2"
                  />
                  Show Follow Button
                </label>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700">Save</button>
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 border border-gray-300 py-2 rounded hover:bg-gray-50 text-black">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;