"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function PostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    // Fetch post data
    fetch(`/api/lab4/post/${id}`)
      .then(r => r.json())
      .then(data => {
        setPost(data);
        setLikes(data.likes?.length || 0);
      });
    
    // Fetch comments
    fetch(`/api/lab7/comments/${id}`)
      .then(r => r.json())
      .then(setComments)
      .catch(() => setComments([]));
  }, [id]);

  const handleLike = async () => {
    const res = await fetch("/api/lab8/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id }),
    });
    
    if (res.ok) {
      const data = await res.json();
      setLiked(data.liked);
      setLikes(data.liked ? likes + 1 : likes - 1);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch("/api/lab7/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id, content: newComment }),
    });
    
    if (res.ok) {
      const comment = await res.json();
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.content?.substring(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (!post) return <div className="max-w-4xl mx-auto mt-10 p-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <article className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <p className="text-gray-600 mb-6">By {post.author?.name || 'Unknown'}</p>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <div className="flex gap-4 mb-8 pb-4 border-b">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-4 py-2 rounded border-2 ${
            liked ? 'border-black bg-black text-white' : 'border-black bg-transparent text-black hover:bg-black hover:text-white'
          }`}
        >
          ❤️ {likes}
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded border-2 border-black bg-transparent text-black hover:bg-black hover:text-white"
        >
          🔗 Share
        </button>
        
        <span className="flex items-center gap-2 px-4 py-2 rounded border-2 border-black bg-transparent text-black">
          💬 {comments.length} Comments
        </span>
      </div>

      <section>
        <h3 className="text-2xl font-bold mb-4">Comments</h3>
        
        <form onSubmit={handleComment} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full p-3 border-2 border-black rounded mb-2 text-black transition-all duration-300 focus:shadow-md focus:scale-105"
            rows={3}
            required
          />
          <button
            type="submit"
            className="border-2 border-black bg-transparent text-black px-4 py-2 rounded hover:bg-black hover:text-white"
          >
            Post Comment
          </button>
        </form>

        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded">
              <p className="font-semibold">{comment.author?.name || 'Anonymous'}</p>
              <p className="text-gray-700 mt-1">{comment.content}</p>
              <p className="text-sm text-gray-500 mt-2">{new Date(comment.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}