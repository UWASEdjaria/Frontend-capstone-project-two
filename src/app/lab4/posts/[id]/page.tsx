"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function PostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [postFollowers, setPostFollowers] = useState(0);
  const [isFollowingPost, setIsFollowingPost] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    fetch(`/api/lab4/post/${id}`)
      .then(r => r.json())
      .then(data => {
        setPost(data);
        setLikes(data.likes?.length || 0);
        setDislikes(data.dislikes?.length || 0);
        setFollowers(data.followers?.length || 0);
        setPostFollowers(data.postFollowers?.length || 0);
        setComments(data.comments || []);
      });
  }, [id]);

  const handleLike = () => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleDislike = () => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    setIsDisliked(!isDisliked);
    setDislikes(isDisliked ? dislikes - 1 : dislikes + 1);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    
    const res = await fetch("/api/lab6/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId: id, content: newComment, authorId: "1" }),
    });
    
    if (res.ok) {
      const comment = await res.json();
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  const handleFollow = () => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    
    setIsFollowing(!isFollowing);
    setFollowers(isFollowing ? followers - 1 : followers + 1);
  };

  const handleFollowPost = () => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    
    setIsFollowingPost(!isFollowingPost);
    setPostFollowers(isFollowingPost ? postFollowers - 1 : postFollowers + 1);
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-600">By {post.author?.name || 'Unknown'}</p>
            <p className="text-sm text-gray-500">{followers} followers</p>
          </div>
          {session && post.authorId !== "1" && (
            <button
              onClick={handleFollow}
              className={`px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition-all ${
                isFollowing ? 'bg-black text-white' : 'bg-white text-black'
              }`}
            >
              {isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <span className="text-gray-600">{postFollowers} people following this post</span>
        {session && (
          <button
            onClick={handleFollowPost}
            className={`px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition-all ${
              isFollowingPost ? 'bg-black text-white' : 'bg-white text-black'
            }`}
          >
            {isFollowingPost ? '📌 Following Post' : '📌 Follow Post'}
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-8 pb-4 border-b">
        {session ? (
          <>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded border-2 transition-all hover:bg-black hover:text-white ${
                isLiked ? 'bg-red-500 text-white border-red-500' : 'border-black bg-transparent text-black'
              }`}
            >
              ❤️ {likes}
            </button>
            
            <button
              onClick={handleDislike}
              className={`flex items-center gap-2 px-4 py-2 rounded border-2 transition-all hover:bg-black hover:text-white ${
                isDisliked ? 'bg-blue-500 text-white border-blue-500' : 'border-black bg-transparent text-black'
              }`}
            >
              👎 {dislikes}
            </button>
          </>
        ) : (
          <>
            <span className="flex items-center gap-2 px-4 py-2 rounded border-2 border-gray-300 bg-gray-100 text-gray-500">
              ❤️ {likes}
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded border-2 border-gray-300 bg-gray-100 text-gray-500">
              👎 {dislikes}
            </span>
          </>
        )}
        
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
        
        {session ? (
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
        ) : (
          <div className="mb-6 p-4 border-2 border-gray-300 rounded bg-gray-50 text-center">
            <p className="text-gray-600">
              <Link href="/lab2/login" className="text-black hover:underline">Login</Link> or <Link href="/lab2/signup" className="text-black hover:underline">Sign up</Link> to comment
            </p>
          </div>
        )}

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