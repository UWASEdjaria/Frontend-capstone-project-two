"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [userLikes, setUserLikes] = useState<{[key: string]: boolean}>({});
  const [userDislikes, setUserDislikes] = useState<{[key: string]: boolean}>({});
  const currentUser = "1"; // Default user
  
  useEffect(() => {
    fetch("/api/lab4/post")
      .then(r => r.json())
      .then(data => {
        setPosts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <h1 className="text-3xl font-bold text-black mb-4">Posts</h1>
      {posts.length === 0 ? (
        <p className="text-black">No posts yet. <Link href="/lab3/editor" className="text-black hover:underline">Create one!</Link></p>
      ) : (
        posts.map(p => (
          <div key={p.id} className="p-6 mb-6 border-2 border-black rounded bg-white">
            <Link href={`/lab4/posts/${p.id}`} className="text-xl font-bold text-black hover:underline">
              {p.title}
            </Link>
            <p className="text-black mt-2">By {p.author?.name || 'Unknown'}</p>
            
            {/* Like, Dislike and Comment Actions */}
            <div className="flex gap-4 mt-4">
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
              <span className="flex items-center gap-2 px-3 py-1">
                💬 {p.comments?.length || 0}
              </span>
            </div>

            {/* Add Comment */}
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
        ))
      )}
    </div>
  );
}