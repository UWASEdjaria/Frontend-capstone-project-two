"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<{[key: string]: boolean}>({});
  const [followedUsers, setFollowedUsers] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    fetch("/api/lab4/post")
      .then(r => r.json())
      .then(data => {
        setPosts(data.slice(0, 3)); // Show only first 3 posts on homepage
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const toggleLike = (postId: string) => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    
    setLikedPosts({
      ...likedPosts,
      [postId]: !likedPosts[postId]
    });
    
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, likes: likedPosts[postId] ? (p.likes || []).slice(0, -1) : [...(p.likes || []), { id: Date.now() }] }
        : p
    ));
  };

  const toggleFollow = (authorId: string) => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    
    setFollowedUsers({
      ...followedUsers,
      [authorId]: !followedUsers[authorId]
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 transition-all duration-300 hover:scale-105">
            Medium
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            A place to write, read, and connect
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/lab3/editor" 
              className="border border-white bg-transparent text-white px-8 py-3 rounded transition-all duration-300 hover:bg-black hover:text-white hover:scale-105"
            >
              Start Writing
            </Link>
            <Link 
              href="/lab4/posts" 
              className="border border-white bg-transparent text-white px-8 py-3 rounded transition-all duration-300 hover:bg-black hover:text-white hover:scale-105"
            >
              Read All Posts
            </Link>
          </div>
        </div>

        {/* Featured Posts Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Posts</h2>
          {loading ? (
            <div className="text-center text-white">Loading posts...</div>
          ) : (
            <div className="grid md:grid-cols-1 gap-8">
              {posts.map(post => (
                <div key={post.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <Link href={`/lab4/posts/${post.id}`} className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
                        {post.title}
                      </Link>
                      <div className="flex items-center mt-2 text-gray-400">
                        <span>By {post.author?.name || 'Demo User'}</span>
                        <span className="mx-2">•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {session && post.authorId !== session?.user?.email && (
                      <button 
                        onClick={() => toggleFollow(post.authorId)}
                        className={`px-4 py-2 rounded text-sm transition-all ${
                          followedUsers[post.authorId] 
                            ? 'bg-white text-gray-900 hover:bg-gray-200' 
                            : 'border border-white text-white hover:bg-white hover:text-gray-900'
                        }`}
                      >
                        {followedUsers[post.authorId] ? 'Following' : 'Follow'}
                      </button>
                    )}
                  </div>
                  
                  <p className="text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {session ? (
                        <button 
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-2 px-3 py-1 rounded transition-all ${
                            likedPosts[post.id] 
                              ? 'bg-red-500 text-white' 
                              : 'border border-gray-600 text-gray-400 hover:border-red-500 hover:text-red-500'
                          }`}
                        >
                          ❤️ {(post.likes?.length || 0) + (likedPosts[post.id] ? 1 : 0)}
                        </button>
                      ) : (
                        <span className="flex items-center gap-2 text-gray-400">
                          ❤️ {post.likes?.length || 0}
                        </span>
                      )}
                      <span className="flex items-center gap-2 text-gray-400">
                        💬 {post.comments?.length || 0}
                      </span>
                      <span className="flex items-center gap-2 text-gray-400">
                        👥 {post.followers?.length || 0} followers
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {post.tags?.map((tag: any) => (
                        <span key={tag.id} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-8">
            <Link 
              href="/lab4/posts" 
              className="inline-block border border-white bg-transparent text-white px-6 py-3 rounded transition-all duration-300 hover:bg-white hover:text-gray-900"
            >
              View All Posts
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 border border-white rounded transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 className="text-xl font-bold text-white mb-3">✍️ Write</h3>
            <p className="text-gray-400">Share your thoughts with rich text formatting and images</p>
          </div>
          
          <div className="p-6 border border-white rounded transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 className="text-xl font-bold text-white  mb-3">💬 Engage</h3>
            <p className="text-gray-400">Comment and like posts from other writers</p>
          </div>
          
          <div className="p-6 border border-white rounded transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 className="text-xl font-bold text-white mb-3">🔍 Discover</h3>
            <p className="text-gray-400">Find interesting content through search and feeds</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Get Started</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/lab2/signup" 
              className="block p-6 border border-white rounded transition-all duration-300 hover:bg-black hover:scale-105 group"
            >
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white">New to Medium?</h3>
              <p className="text-gray-400 group-hover:text-white">Sign up to start writing and engaging with the community</p>
            </Link>
            
            <Link 
              href="/lab2/login" 
              className="block p-6 border border-white rounded transition-all duration-300 hover:bg-black hover:scale-105 group"
            >
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white">Already have an account?</h3>
              <p className="text-gray-400 group-hover:text-white">Log in to continue your writing journey</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
