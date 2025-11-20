"use client";

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Lab3() {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/lab3/posts')
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

  const deletePost = async (postId: string) => {
    if (!session) {
      router.push('/lab2/login');
      return;
    }

    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`/api/lab3/posts/${postId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setPosts(posts.filter(p => p.id !== postId));
        } else {
          alert('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    }
  };

  return (
    <div className="min-h-screen py-8" style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-xl border-2 border-gray-300 p-6 md:p-8 mb-6">
          <h1 className="text-3xl font-bold mb-8 text-black text-center">Rich Content Editor</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/lab3/editor"
              className="block p-6 bg-white/80 border-2 border-gray-300 rounded-lg hover:bg-white transition-all shadow-lg"
            >
              <h2 className="text-xl font-semibold text-black mb-2">Rich Text Editor</h2>
              <p className="text-gray-700">Create posts with rich formatting, images, and embeds</p>
            </Link>

            <Link
              href="/lab4/posts"
              className="block p-6 bg-white/80 border-2 border-gray-300 rounded-lg hover:bg-white transition-all shadow-lg"
            >
              <h2 className="text-xl font-semibold text-black mb-2">View Posts</h2>
              <p className="text-gray-700">Browse all published posts</p>
            </Link>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-xl border-2 border-gray-300 p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-black">Your Posts</h2>

          {loading ? (
            <p className="text-black">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="text-black">No posts yet. <Link href="/lab3/editor" className="text-black hover:underline">Create one!</Link></p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(p => (
                <div key={p.id} className="p-6 border-2 border-black rounded bg-white/80 backdrop-blur-sm h-fit shadow-lg">
                  <div className="flex justify-between items-start mb-2">
                    <Link href={`/lab3/posts/${p.id}`} className="text-xl font-bold text-black hover:underline flex-1">
                      {p.title}
                    </Link>
                    {session && p.authorId === session?.user?.email && (
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
                  <p className="text-black">By {p.author?.name || 'Unknown'}</p>
                  <p className="text-sm text-gray-600">{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
