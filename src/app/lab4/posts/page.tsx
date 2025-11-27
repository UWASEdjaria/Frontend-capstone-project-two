/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PostsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [followedUsers, setFollowedUsers] = useState<{[key: string]: boolean}>({});

  const [likedPosts, setLikedPosts] = useState<{[key: string]: boolean}>({});
  const [dislikedPosts, setDislikedPosts] = useState<{[key: string]: boolean}>({});
  const [submittingComment, setSubmittingComment] = useState<{[key: string]: boolean}>({});
  const currentUser = session?.user?.email;
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/api/lab3/posts");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched posts:', data);
        
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        
        const postsWithCounts = data.map((post: any) => ({
          ...post,
          likes: post.likes || [],
          dislikes: post.dislikes || [],
          followers: post.followers || [],
          postFollowers: post.postFollowers || []
        }));
        
        setAllPosts(postsWithCounts);
        
        const uniqueCategories = [...new Set(data.flatMap((post: any) => 
          post.tags?.map((tag: any) => tag.name) || []
        ))] as string[];
        setCategories(uniqueCategories);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err instanceof Error ? err.message : 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  // Filter posts based on search and category
  const posts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesSearch = !searchTerm ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = !selectedCategory ||
        post.tags?.some((tag: any) => tag.name === selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory, allPosts]);

  const toggleLike = (postId: string) => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    
    try {
      const isLiked = likedPosts[postId];
      
      setLikedPosts(prev => ({
        ...prev,
        [postId]: !isLiked
      }));
      
      setAllPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, likes: isLiked ? p.likes.slice(0, -1) : [...(p.likes || []), { id: Date.now() }] }
          : p
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const toggleDislike = (postId: string) => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    
    try {
      const isDisliked = dislikedPosts[postId];
      
      setDislikedPosts(prev => ({
        ...prev,
        [postId]: !isDisliked
      }));
      
      setAllPosts(prev => prev.map(p => 
        p.id === postId 
          ? { ...p, dislikes: isDisliked ? p.dislikes.slice(0, -1) : [...(p.dislikes || []), { id: Date.now() }] }
          : p
      ));
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  const deletePost = async (postId: string) => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/lab4/post/${postId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setAllPosts(prev => prev.filter(p => p.id !== postId));
        } else {
          alert('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    }
  };

  const toggleFollow = (postId: string) => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }

    const isFollowing = followedUsers[postId];

    // Update follow state per post
    setFollowedUsers({
      ...followedUsers,
      [postId]: !isFollowing
    });

    setAllPosts(prev => prev.map(p =>
      p.id === postId
        ? {
            ...p,
            followers: isFollowing
              ? p.followers.filter((f: any) => f.id !== currentUser)
              : p.followers.some((f: any) => f.id === currentUser) ? p.followers : [...(p.followers || []), { id: currentUser }]
          }
        : p
    ));
  };



  const addComment = async (postId: string) => {
    const content = newComment[postId];
    if (!content || submittingComment[postId]) return;

    setSubmittingComment({ ...submittingComment, [postId]: true });
    
    try {
      const response = await fetch("/api/lab6/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, postId, authorId: currentUser }),
      });

      if (response.ok) {
        const newCommentData = await response.json();
        setNewComment({ ...newComment, [postId]: "" });
        
        setAllPosts(prev => prev.map(p => 
          p.id === postId 
            ? { 
                ...p, 
                comments: [...(p.comments || []), newCommentData]
              }
            : p
        ));
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmittingComment({ ...submittingComment, [postId]: false });
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="text-xl font-semibold text-black">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg text-center">
          <p className="text-xl font-semibold text-red-600 mb-4">Error loading posts</p>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen" style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
    <div className="max-w-6xl mx-auto pt-10 p-4">
      <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 mb-6 shadow-lg">
        <h1 className="text-3xl font-bold text-black mb-6">Posts</h1>
      </div>
      
      {/* Search and Filter Section */}
      <div className="mb-6 space-y-4 bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-lg">
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
            aria-label="Select category"
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
        <p className="text-black">No posts yet. <Link href="/lab3/editor" className="text-black hover:underline" onClick={(e) => { if (!session) { e.preventDefault(); router.push('/lab2/login'); } }}>Create one!</Link></p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map(p => (
            <div key={p.id} className="p-6 border-2 border-black rounded bg-white/80 backdrop-blur-sm h-fit shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <Link href={`/lab4/posts/${p.id}`} className="text-xl font-bold text-black hover:underline flex-1">
                {p.title}
              </Link>
              {session && p.author?.email === session?.user?.email && (
                <div className="flex gap-2 ml-2">
                  <Link 
                    href={`/lab3/editor?edit=${p.id}`}
                    className="px-3 py-1 border border-black rounded hover:bg-black hover:text-white transition-all"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => deletePost(p.id)}
                    className="px-3 py-1 border border-black rounded hover:bg-black hover:text-white transition-all"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <div>
                <p className="text-black">By {p.author?.name || 'Unknown'}</p>
                <p className="text-sm text-gray-600">{p.followers?.length || 0} followers</p>
              </div>
              {session && (
                <button
                  onClick={() => toggleFollow(p.id)}
                  className={`px-3 py-1 border border-black rounded hover:bg-black hover:text-white transition-all text-sm ${
                    followedUsers[p.id] ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  {followedUsers[p.id] ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>


            {/* Like, Dislike and Comment Actions */}
            <div className="flex gap-4 mt-4">
              {session ? (
                <>
                  <button 
                    onClick={() => toggleLike(p.id)}
                    className={`flex items-center gap-2 px-3 py-1 border border-black rounded transition-all hover:bg-black hover:text-white ${
                      likedPosts[p.id] ? 'bg-red-500 text-white border-red-500' : 'bg-white text-black'
                    }`}
                  >
                    ❤️ {p.likes?.length || 0}
                  </button>
                  <button 
                    onClick={() => toggleDislike(p.id)}
                    className={`flex items-center gap-2 px-3 py-1 border border-black rounded transition-all hover:bg-black hover:text-white ${
                      dislikedPosts[p.id] ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-black'
                    }`}
                  >
                    👎 {p.dislikes?.length || 0}
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
                    disabled={submittingComment[p.id]}
                    className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition-all disabled:bg-gray-400"
                  >
                    {submittingComment[p.id] ? 'Posting...' : 'Post'}
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
                  <div key={comment.id} className="p-3 bg-white/80 backdrop-blur-sm border-2 border-black rounded">
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
    </div>
  );
}