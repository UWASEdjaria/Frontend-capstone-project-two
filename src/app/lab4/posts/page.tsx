"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function PostsPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [userLikes, setUserLikes] = useState<{[key: string]: boolean}>({});
  const [userDislikes, setUserDislikes] = useState<{[key: string]: boolean}>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const currentUser = session?.user?.id || "1"; // Use session user ID
  
  useEffect(() => {
    fetch("/api/lab4/post")
      .then(r => r.json())
      .then(data => {
        setPosts(data);
        setAllPosts(data);
        // Extract unique categories from posts
        const uniqueCategories = [...new Set(data.flatMap((post: any) => 
          post.tags?.map((tag: any) => tag.name) || []
        ))];
        setCategories(uniqueCategories);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Filter posts based on search and category
  useEffect(() => {
    let filtered = allPosts;
    
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(post => 
        post.tags?.some((tag: any) => tag.name === selectedCategory)
      );
    }
    
    setPosts(filtered);
  }, [searchTerm, selectedCategory, allPosts]);

  const toggleLike = async (postId: string) => {
    // Always add like (keep increasing)
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, likes: [...(p.likes || []), { userId: currentUser + Date.now() }] }
        : p
    ));
  };

  const toggleDislike = async (postId: string) => {
    // Always add dislike (keep increasing)
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, dislikes: [...(p.dislikes || []), { userId: currentUser + Date.now() }] }
        : p
    ));
  };

  const addComment = async (postId: string) => {
    const content = newComment[postId];
    if (!content) return;
    
    await fetch("/api/lab6/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, postId, authorId: currentUser }),
    });
    
    setNewComment({ ...newComment, [postId]: "" });
    // Refresh posts
    const res = await fetch("/api/lab4/post");
    const data = await res.json();
    setPosts(data);
  };
  
  if (loading) return <div className="max-w-4xl mx-auto mt-10">Loading...</div>;
  
  return (
    <div className="max-w-6xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-black mb-6">Posts</h1>
      
      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 border-2 border-black rounded text-black"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-3 border-2 border-black rounded text-black bg-white"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedCategory("");
            }}
            className="px-4 py-3 border-2 border-black rounded hover:bg-black hover:text-white transition-all"
          >
            Clear
          </button>
        </div>
      </div>
      
      {posts.length === 0 && !loading ? (
        <p className="text-black">No posts yet. <Link href="/lab3/editor" className="text-black hover:underline">Create one!</Link></p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(p => (
            <div key={p.id} className="p-6 border-2 border-black rounded bg-white h-fit">
            <Link href={`/lab4/posts/${p.id}`} className="text-xl font-bold text-black hover:underline">
              {p.title}
            </Link>
            <p className="text-black mt-2">By {p.author?.name || 'Unknown'}</p>
            
            {/* Like, Dislike and Comment Actions */}
            <div className="flex gap-4 mt-4">
              {session ? (
                <>
                  <button 
                    onClick={() => toggleLike(p.id)}
                    className="flex items-center gap-2 px-3 py-1 border border-black rounded transition-all hover:bg-black group"
                  >
                    <span className="group-hover:text-white text-black">❤️ {p.likes?.length || 0}</span>
                  </button>
                  <button 
                    onClick={() => toggleDislike(p.id)}
                    className="flex items-center gap-2 px-3 py-1 border border-black rounded transition-all hover:bg-black group"
                  >
                    <span className="group-hover:text-white text-black">👎 {p.dislikes?.length || 0}</span>
                  </button>
                </>
              ) : (
                <>
                  <span className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded bg-gray-100">
                    <span className="text-gray-500">❤️ {p.likes?.length || 0}</span>
                  </span>
                  <span className="flex items-center gap-2 px-3 py-1 border border-gray-300 rounded bg-gray-100">
                    <span className="text-gray-500">👎 {p.dislikes?.length || 0}</span>
                  </span>
                </>
              )}
              <span className="flex items-center gap-2 px-3 py-1">
                💬 {p.comments?.length || 0}
              </span>
            </div>

            {/* Add Comment */}
            {session ? (
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment[p.id] || ""}
                    onChange={(e) => setNewComment({ ...newComment, [p.id]: e.target.value })}
                    className="flex-1 p-2 border border-black rounded text-black"
                  />
                  <button
                    onClick={() => addComment(p.id)}
                    className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition-all"
                  >
                    Post
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-4 p-3 border border-gray-300 rounded bg-gray-50">
                <p className="text-gray-600 text-center">
                  <Link href="/lab2/login" className="text-black hover:underline">Login</Link> or <Link href="/lab2/signup" className="text-black hover:underline">Sign up</Link> to comment
                </p>
              </div>
            )}

            {/* Show Comments */}
            {p.comments && p.comments.length > 0 && (
              <div className="mt-4 space-y-2">
                {p.comments.map((comment: any) => (
                  <div key={comment.id} className="p-3 bg-gray-50 border border-black rounded">
                    <p className="text-sm font-semibold text-black">{comment.author?.name || 'Unknown'}</p>
                    <p className="text-black">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}