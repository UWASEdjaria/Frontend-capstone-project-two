"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function Editor() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Load post for editing if editId is provided
    if (editId) {
      setIsEditing(true);
      fetch(`/api/lab4/post/${editId}`)
        .then(r => r.json())
        .then(data => {
          setTitle(data.title);
          setContent(data.content);
          setCategory(data.tags?.[0]?.name || "");
        })
        .catch(err => console.error('Error loading post:', err));
    }
  }, [editId]);

  const categories = ["Technology", "Writing", "Business", "Lifestyle"];

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg border-2 border-gray-300 p-8">
          <h2 className="text-2xl font-bold mb-4 text-black text-center">Please Login</h2>
          <p className="mb-6 text-gray-600 text-center">You need to login to write posts.</p>
          <button 
            onClick={() => router.push('/lab2/login')} 
            className="w-full border-2 border-black px-4 py-3 rounded-lg hover:bg-black hover:text-white text-black font-medium transition-all"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const config = {
    placeholder: "Write your story...",
    buttons: ["bold", "italic", "ul", "ol", "link"]
  };

  const publishPost = async () => {
    if (!title || !content || !category) {
      alert("Please fill title, content and category!");
      return;
    }
    
    try {
      const url = isEditing ? `/api/lab4/post/${editId}` : "/api/lab4/post";
      const method = isEditing ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: title.trim(), 
          content: content.trim(),
          tags: [category]
        })
      });
      
      if (response.ok) {
        alert(isEditing ? "Post updated!" : "Post published!");
        router.push("/lab4/posts");
      } else {
        alert(isEditing ? "Failed to update" : "Failed to publish");
      }
    } catch (error) {
      alert(isEditing ? "Error updating" : "Error publishing");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg border-2 border-gray-300 p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-8 text-black text-center">{isEditing ? 'Edit Story' : 'Write a Story'}</h1>
          
          <div className="space-y-6">
            <input
              placeholder="Story title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg text-black bg-white focus:border-blue-500 focus:outline-none"
            />
            
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-black bg-white focus:border-blue-500 focus:outline-none"
            >
              <option value="">Choose category</option>
              {categories.map((cat: string) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <div className="min-h-[400px] border-2 border-gray-300 rounded-lg">
              {isClient && (
                <JoditEditor
                  value={content}
                  config={config}
                  onBlur={(newContent: string) => setContent(newContent)}
                  onChange={(newContent: string) => setContent(newContent)}
                />
              )}
            </div>
            
            <div className="text-center">
              <button 
                onClick={publishPost}
                className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 font-medium text-lg transition-colors"
              >
{isEditing ? 'Update Story' : 'Publish Story'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}