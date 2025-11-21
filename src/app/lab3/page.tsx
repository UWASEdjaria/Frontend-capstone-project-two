"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Post as PrismaPost, User } from "@/generated/prisma";
//post that also includes its author, but the author might be missing (null)
type Post = PrismaPost & {
  author: User | null;
};

export default function PostDetails() {
  const { data: session } = useSession();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/lab3/posts")
      .then((r) => r.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleDelete = (post: Post) => {
    if (!session) {
      alert("Please login to delete a post");
      router.push("/lab2/login");
      return;
    }

    if (post.author?.email !== session.user?.email) {
      alert("You can only delete your own posts");
      return;
    }

    if (confirm("Are you sure you want to delete this post?")) {
      fetch(`/api/lab3/posts/${post.id}`, { method: "DELETE" })
        .then((res) => {
          if (res.ok) setPosts(posts.filter((p) => p.id !== post.id));
          else alert("Failed to delete post");
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Cards */}
        <div className="bg-gray-700/80 backdrop-blur-sm rounded-lg shadow-xl border-2 border-gray-600 p-6 md:p-8 mb-6">
          <h1 className="text-3xl font-bold mb-8 text-white text-center">
            Rich Content Editor
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/lab3/editor"
              className="block p-6 bg-gray-600/80 border-2 border-gray-500 rounded-lg hover:bg-gray-600 transition-all shadow-lg"
            >
              <h2 className="text-xl font-semibold text-white mb-2">Rich Text Editor</h2>
              <p className="text-gray-300">Create posts with rich formatting, images, and embeds</p>
            </Link>

            <Link
              href="/lab4/posts"
              className="block p-6 bg-gray-600/80 border-2 border-gray-500 rounded-lg hover:bg-gray-600 transition-all shadow-lg"
            >
              <h2 className="text-xl font-semibold text-white mb-2">View Posts</h2>
              <p className="text-gray-300">Browse all published posts</p>
            </Link>
          </div>
        </div>

        {/* Posts */}
        <div className="bg-gray-700/80 backdrop-blur-sm rounded-lg shadow-xl border-2 border-gray-600 p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">Your Posts</h2>

          {loading ? (
            <p className="text-white">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="text-white">
              No posts yet.{" "}
              <Link href="/lab3/editor" className="text-white hover:underline">
                Create one!
              </Link>
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="p-6 border border-white rounded bg-gray-600/80 backdrop-blur-sm h-fit shadow-lg"
                >
                  <div className="flex justify-between items-start mb-2">
                    <Link
                      href={`/lab3/posts/${p.id}`}
                      className="text-xl font-bold text-white hover:underline flex-1"
                    >
                      {p.title}
                    </Link>

                    {/* Edit & Delete Buttons visible only if logged in */}
                    {session && (
                      <div className="flex gap-2 ml-2">
                        <Link
                          href={`/lab3/editor?edit=${p.id}`}
                          className="px-3 text-white py-1 border border-white rounded hover:bg-black hover:text-gray transition-all"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(p)}
                          className="px-3 text-white py-1 border border-white rounded hover:bg-black hover:text-gray  transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-white">By {p.author?.name || "Unknown"}</p>
                  <p className="text-sm text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
