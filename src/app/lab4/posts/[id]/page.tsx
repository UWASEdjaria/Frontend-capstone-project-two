"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function PostPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [post, setPost] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

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

  const handleEditComment = (index: number, content: string) => {
    setEditingComment(index);
    setEditText(content);
  };

  const handleSaveEdit = (index: number) => {
    const updatedComments = [...comments];
    updatedComments[index].content = editText;
    setComments(updatedComments);
    setEditingComment(null);
    setEditText("");
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditText("");
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

  const handleDeletePost = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      router.push('/lab4/posts');
    }
  };

  const handleDeleteComment = (index: number) => {
    if (confirm('Are you sure you want to delete this comment?')) {
      const updatedComments = comments.filter((_, i) => i !== index);
      setComments(updatedComments);
    }
  };

  if (!post) return <div className="max-w-4xl mx-auto mt-10 p-4 text-white">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4">
      <article className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white">{post.title}</h1>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-white">By {post.author?.name || 'Unknown'}</p>
            <p className="text-sm text-white">{followers} followers</p>
          </div>
          <div className="flex gap-2">
            {session && (post.authorId === session?.user?.email) && (
              <>
                <Link
                  href={`/lab3/editor?edit=${post.id}`}
                  className="px-3 py-2 border border-white rounded hover:bg-black hover:text-white transition-all text-sm"
                >
                  Edit
                </Link>
                <button
                  onClick={handleDeletePost}
                  className="px-3 py-2 border border-red-500 text-red-500 rounded hover:bg-red-500 hover:text-white transition-all text-sm"
                >
                  Delete
                </button>
              </>
            )}
            {session && post.authorId !== session?.user?.email && (
              <button
                onClick={handleFollow}
                className={`px-4 py-2 border border-white rounded hover:bg-black hover:text-white transition-all ${
                  isFollowing ? 'bg-black text-white' : 'bg-white text-black'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>
        </div>
        <div 
          className="prose max-w-none text-white post-content" 
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        {post.imageUrl && (
          <div className="mt-4 flex justify-center">
            <img 
              src={post.imageUrl} 
              alt={post.title}
              className="w-72 h-60 object-cover rounded-lg shadow-md"
              onError={(e) => {
                console.log('Image failed to load:', post.imageUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </article>

      <div className="flex justify-between items-center mb-4 pb-4 border-b">
        <span className="text-white">{postFollowers} people following this post</span>
        {session && (
          <button
            onClick={handleFollowPost}
            className={`px-4 py-2 border border-white rounded hover:bg-black hover:text-white transition-all ${
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
                isLiked ? 'bg-red-500 text-white border-red-500' : 'border-black bg-transparent text-white'
              }`}
            >
              ❤️ {likes}
            </button>

            <button
              onClick={handleDislike}
              className={`flex items-center gap-2 px-4 py-2 rounded border-2 transition-all hover:bg-black hover:text-white ${
                isDisliked ? 'bg-blue-500 text-white border-blue-500' : 'border-black bg-transparent text-white'
              }`}
            >
              👎 {dislikes}
            </button>
          </>
        ) : (
          <>
            <span className="flex items-center gap-2 px-4 py-2 rounded border border-white text-gray-500">
              ❤️ {likes}
            </span>
            <span className="flex items-center gap-2 px-4 py-2 rounded border border-gray-300 bg-gray-100 text-gray-500">
              👎 {dislikes}
            </span>
          </>
        )}

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded border-2 border-white bg-transparent text-white hover:bg-black hover:text-white"
        >
          🔗 Share
        </button>

        <span className="flex items-center gap-2 px-4 py-2 rounded border-2 border-white bg-transparent text-white">
          💬 {comments.length} Comments
        </span>
      </div>

      <section>
        <h3 className="text-2xl font-bold mb-4 text-white">Comments</h3>

        {session ? (
          <form onSubmit={handleComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full p-3 border-2 border-gray-300 rounded-lg mb-2 text-black bg-white transition-all duration-300 focus:shadow-md focus:border-gray-500"
              rows={3}
              required
            />
            <button
              type="submit"
              className="border-2 border-gray-300 bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-all font-medium"
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

        <div className="space-y-0">
          {comments.map((comment, index) => (
            <div key={index} className="p-3 text-black bg-white border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-black text-sm">{comment.author?.name || 'Anonymous'}</p>
                {session && comment.author?.email === session.user?.email && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditComment(index, comment.content)}
                      className="text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(index)}
                      className="text-xs text-red-600 hover:text-red-800 px-2 py-1 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              {editingComment === index ? (
                <div className="mt-2">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-black"
                    rows={3}
                  />
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSaveEdit(index)}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-black mt-2 leading-relaxed">{comment.content}</p>
              )}
              <p className="text-sm text-gray-500 mt-3">{new Date(comment.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
