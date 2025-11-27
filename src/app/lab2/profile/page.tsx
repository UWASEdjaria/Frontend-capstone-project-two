"use client";

import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Profile: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(true);
  const [posts, setPosts] = useState<{ id: string; title: string; imageUrl?: string; createdAt: string; excerpt?: string }[]>([]);
  const [followers, setFollowers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [followingUsers, setFollowingUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [followingPosts, setFollowingPosts] = useState<any[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: ''
  });

  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (session?.user) {
      setEditForm(prev => ({
        ...prev,
        name: session.user?.name || ''
      }));
      fetchUserData();
    }
  }, [session?.user]);

  useEffect(() => {
    const handleFocus = () => {
      if (session?.user) {
        fetchUserData();
      }
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [session?.user]);

  const fetchUserData = async () => {
    if (!session?.user?.email) return;
    
    try {
      setLoading(true);
      
      const userRes = await fetch('/api/lab2/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: session.user.email })
      });
      
      if (userRes.ok) {
        const userData = await userRes.json();
        const userId = userData.userId;
        
        const postsRes = await fetch('/api/lab3/posts');
        if (postsRes.ok) {
          const allPostsData = await postsRes.json();
          const userPosts = allPostsData.filter((post: { authorId: string }) => post.authorId === userId);
          setPosts(userPosts);
          setAllPosts(allPostsData);
        }
        
        setFollowersCount(userData.followersCount || 0);
        setFollowingCount(userData.followingCount || 0);
        
        const followersListRes = await fetch('/api/lab2/profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: session.user.email, getFollowers: true })
        });
        
        if (followersListRes.ok) {
          const followersData = await followersListRes.json();
          setFollowers(followersData.followers || []);
        }
        
        // Fetch users that current user is following
        const followsRes = await fetch('/api/lab9/follow/following', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail: session.user.email })
        });
        
        if (followsRes.ok) {
          const followsData = await followsRes.json();
          const following = followsData.following || [];
          setFollowingUsers(following);
          
          // Get posts from followed users only
          const followingUserIds = following.map((user: any) => user.id);
          const followingUserPosts = allPostsData.filter((post: any) => 
            followingUserIds.includes(post.authorId)
          );
          setFollowingPosts(followingUserPosts);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/lab2/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: session?.user?.email,
          name: editForm.name,
          bio: editForm.bio 
        })
      });
      if (response.ok) {
        setShowEditModal(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push('/lab2/login');
    }
  }, [session, status, router]);

  if (status === "loading" || loading) return <div className="text-center mt-10 text-white">Loading...</div>;
  
  if (!session) {
    return null;
  }

  const initial = session.user?.name?.charAt(0).toUpperCase() || session.user?.email?.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl mx-auto mt-10">
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
        <button onClick={() => signOut({ callbackUrl: "/lab2/login" })} className="flex-1 border border-white text-white rounded-md py-1 text-sm font-semibold hover:bg-white hover:text-black transition">Logout</button>
      </div>

      {/* User Posts */}
      <div className="mt-6 px-4">
        <h3 className="text-white text-lg font-semibold mb-3">My Posts ({posts.length})</h3>
        {posts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/lab4/posts/${post.id}`}>
                <div className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/20 transition">
                  <h4 className="text-white font-medium text-sm mb-2">{post.title}</h4>
                  {post.excerpt && (
                    <p className="text-white/70 text-xs mb-2">{post.excerpt.replace(/<[^>]*>/g, '').replace(/&lt;|&gt;|&amp;|&quot;|&#39;/g, '')}</p>
                  )}
                  {post.imageUrl && (
                    <Image src={post.imageUrl} alt={post.title} width={300} height={200} className="w-full h-32 object-cover rounded" />
                  )}
                  <p className="text-white/50 text-xs mt-2">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-white/70 text-sm">No posts yet</p>
        )}
      </div>

      {/* Followers */}
      <div className="mt-6 px-4">
        <h3 className="text-white text-lg font-semibold mb-3">Followers ({followersCount})</h3>
        {followers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {followers.map((follower) => (
              <div key={follower.id} className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                  {follower.name?.charAt(0).toUpperCase() || follower.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{follower.name || 'User'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/70 text-sm">No followers yet</p>
        )}
      </div>

      {/* Following Users */}
      <div className="mt-6 px-4">
        <h3 className="text-white text-lg font-semibold mb-3">Following ({followingCount})</h3>
        {followingUsers.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {followingUsers.map((user) => (
              <div key={user.id} className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{user.name || 'User'}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/70 text-sm">Not following anyone yet</p>
        )}
      </div>

      {/* Posts from Following */}
      <div className="mt-6 px-4">
        <h3 className="text-white text-lg font-semibold mb-3">Posts from Following ({followingPosts.length})</h3>
        {followingPosts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {followingPosts.map((post) => (
              <Link key={post.id} href={`/lab4/posts`}>
                <div className="bg-white/10 rounded-lg p-4 cursor-pointer hover:bg-white/20 transition">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">
                      {post.author?.name?.charAt(0).toUpperCase() || post.author?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <p className="text-white/70 text-xs">{post.author?.name || 'User'}</p>
                  </div>
                  <h4 className="text-white font-medium text-sm mb-2">{post.title}</h4>
                  {post.excerpt && (
                    <p className="text-white/70 text-xs mb-2">{post.excerpt.replace(/<[^>]*>/g, '').replace(/&lt;|&gt;|&amp;|&quot;|&#39;/g, '')}</p>
                  )}
                  {post.imageUrl && (
                    <Image src={post.imageUrl} alt={post.title} width={300} height={200} className="w-full h-32 object-cover rounded" />
                  )}
                  <p className="text-white/50 text-xs mt-2">
                    {new Date(post.createdAt).toLocaleDateDate()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-white/70 text-sm">No posts from followed users</p>
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