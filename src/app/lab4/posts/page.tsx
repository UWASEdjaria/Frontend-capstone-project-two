"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function PostsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [allPosts, setAllPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState<{[key: string]: string}>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [followedUsers, setFollowedUsers] = useState<{[key: string]: boolean}>({});
  const [followedPosts, setFollowedPosts] = useState<{[key: string]: boolean}>({});
  const [likedPosts, setLikedPosts] = useState<{[key: string]: boolean}>({});
  const [dislikedPosts, setDislikedPosts] = useState<{[key: string]: boolean}>({});
  const currentUser = session?.user?.email || "1"; // Use session user email
  
  useEffect(() => {
    fetch("/api/lab4/post")
      .then(r => r.json())
      .then(data => {
        const postsWithCounts = data.map((post: any) => ({
          ...post,
          likes: post.likes || [],
          dislikes: post.dislikes || [],
          followers: post.followers || [],
          postFollowers: post.postFollowers || []
        }));
        setPosts(postsWithCounts);
        setAllPosts(postsWithCounts);
        const uniqueCategories = [...new Set(data.flatMap((post: any) => 
          post.tags?.map((tag: any) => tag.name) || []
        ))] as string[];
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

  const toggleLike = (postId: string) => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    
    const isLiked = likedPosts[postId];
    
    setLikedPosts({
      ...likedPosts,
      [postId]: !isLiked
    });
    
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, likes: isLiked ? p.likes.slice(0, -1) : [...(p.likes || []), { id: Date.now() }] }
        : p
    ));
    setAllPosts(allPosts.map(p => 
      p.id === postId 
        ? { ...p, likes: isLiked ? p.likes.slice(0, -1) : [...(p.likes || []), { id: Date.now() }] }
        : p
    ));
  };

  const toggleDislike = (postId: string) => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    
    const isDisliked = dislikedPosts[postId];
    
    setDislikedPosts({
      ...dislikedPosts,
      [postId]: !isDisliked
    });
    
    setPosts(posts.map(p => 
      p.id === postId 
        ? { ...p, dislikes: isDisliked ? p.dislikes.slice(0, -1) : [...(p.dislikes || []), { id: Date.now() }] }
        : p
    ));
    setAllPosts(allPosts.map(p => 
      p.id === postId 
        ? { ...p, dislikes: isDisliked ? p.dislikes.slice(0, -1) : [...(p.dislikes || []), { id: Date.now() }] }
        : p
    ));
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
          setPosts(posts.filter(p => p.id !== postId));
          setAllPosts(allPosts.filter(p => p.id !== postId));
        } else {
          alert('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    }
  };

  const toggleFollow = (authorId: string) => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    
    const isFollowing = followedUsers[authorId];
    
    // Update follow state
    setFollowedUsers({
      ...followedUsers,
      [authorId]: !isFollowing
    });
    
    // Update follower counts in posts
    const updatePosts = (postsList: any[]) => postsList.map(p => 
      p.authorId === authorId 
        ? { 
            ...p, 
            followers: isFollowing 
              ? p.followers.filter((f: any) => f.id !== currentUser)
              : [...(p.followers || []), { id: currentUser }]
          }
        : p
    );
    
    setPosts(updatePosts(posts));
    setAllPosts(updatePosts(allPosts));
  };

  const toggleFollowPost = (postId: string) => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }
    
    const isFollowing = followedPosts[postId];
    
    setFollowedPosts({
      ...followedPosts,
      [postId]: !isFollowing
    });
    
    const updatePosts = (postsList: any[]) => postsList.map(p => 
      p.id === postId 
        ? { 
            ...p, 
            postFollowers: isFollowing 
              ? p.postFollowers.filter((f: any) => f.id !== currentUser)
              : [...(p.postFollowers || []), { id: currentUser }]
          }
        : p
    );
    
    setPosts(updatePosts(posts));
    setAllPosts(updatePosts(allPosts));
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
            <div key={p.id} className="p-6 border-2 border-black rounded bg-white/80 backdrop-blur-sm h-fit shadow-lg">
            <div className="flex justify-between items-start mb-2">
              <Link href={`/lab4/posts/${p.id}`} className="text-xl font-bold text-black hover:underline flex-1">
                {p.title}
              </Link>
              {session && (p.authorId === currentUser || p.authorId === session?.user?.email) && (
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
              {session && p.authorId !== currentUser && (
                <button 
                  onClick={() => toggleFollow(p.authorId)}
                  className={`px-3 py-1 border border-black rounded hover:bg-black hover:text-white transition-all text-sm ${
                    followedUsers[p.authorId] ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  {followedUsers[p.authorId] ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </div>
            
            {/* Follow Post Button */}
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-600">{p.postFollowers?.length || 0} post followers</span>
              {session && (
                <button 
                  onClick={() => toggleFollowPost(p.id)}
                  className={`px-3 py-1 border border-black rounded hover:bg-black hover:text-white transition-all text-sm ${
                    followedPosts[p.id] ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  {followedPosts[p.id] ? '📌 Following Post' : '📌 Follow Post'}
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
    </div>
  );
}