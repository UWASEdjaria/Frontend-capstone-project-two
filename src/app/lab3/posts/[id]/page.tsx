"use client";

import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  author: {
    name: string | null;
  } | null;
}

export default function PostDetail() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/lab3/posts/${postId}`)
      .then(r => r.json())
      .then(data => {
        setPost(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [postId]);

  const deletePost = async () => {
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
          router.push('/lab3');
        } else {
          alert('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-xl border-2 border-gray-300 p-6 md:p-8">
            <p className="text-black">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen py-8" style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-xl border-2 border-gray-300 p-6 md:p-8">
            <p className="text-black">Post not found.</p>
            <Link href="/lab3" className="text-black hover:underline">Back to posts</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8" style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-lg shadow-xl border-2 border-gray-300 p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">{post.title}</h1>
              <p className="text-gray-600">By {post.author?.name || 'Unknown'} • {new Date(post.createdAt).toLocaleDateString()}</p>
            </div>
            {session && post.authorId === session?.user?.email && (
              <div className="flex gap-2">
                <Link
                  href={`/lab3/editor?edit=${post.id}`}
                  className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition-all"
                >
                  Edit
                </Link>
                <button
                  onClick={deletePost}
                  className="px-4 py-2 border border-black rounded hover:bg-black hover:text-white transition-all"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <div className="prose max-w-none text-black" dangerouslySetInnerHTML={{ __html: post.content }} />
          <div className="mt-8">
            <Link href="/lab3" className="text-black hover:underline">← Back to posts</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
