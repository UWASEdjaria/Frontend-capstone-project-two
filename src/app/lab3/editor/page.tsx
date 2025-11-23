"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { CATEGORIES, BG_STYLE, apiCall, uploadImage } from "@/lib/utils";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

type Draft = { id: number; title: string; content: string; category: string; date: string };

export default function Editor() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ title: "", content: "", category: "", imageUrl: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={BG_STYLE}>
        <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-gray-300 p-8">
          <h2 className="text-2xl font-bold mb-4 text-black text-center">Please Login</h2>
          <p className="mb-6 text-gray-600 text-center">You need to login to write posts.</p>
          <button onClick={() => router.push('/lab2/login')} className="w-full border-2 border-black px-4 py-3 rounded-lg hover:bg-black hover:text-white text-black font-medium transition-all">
            Login
          </button>
        </div>
      </div>
    );
  }

  const saveDraft = () => {
    if (!form.title && !form.content) return alert("Nothing to save!");
    setDrafts([{ id: Date.now(), ...form, title: form.title || "Untitled", date: new Date().toLocaleDateString() }, ...drafts]);
    alert("Draft saved!");
  };

  const loadDraft = (draft: Draft) => setForm({ title: draft.title, content: draft.content, category: draft.category, imageUrl: "" });
  const deleteDraft = (id: number) => setDrafts(drafts.filter(d => d.id !== id));

  const publishPost = async () => {
    if (!form.title || !form.content) return alert("Please fill title and content!");
    setUploading(true);
    try {
      const imageUrl = imageFile ? await uploadImage(imageFile) : form.imageUrl;
      if (imageFile && !imageUrl) return setUploading(false);
      
      const result = await apiCall("/api/lab4/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags: form.category ? [form.category] : [], imageUrl })
      });
      
      if (result.ok) {
        alert("Post published!");
        setForm({ title: "", content: "", category: "", imageUrl: "" });
        setImageFile(null);
        router.push("/lab4/posts");
      } else {
        alert("Failed to publish: " + result.data);
      }
    } catch (error) {
      alert("Error publishing: " + error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen py-8" style={BG_STYLE}>
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-gray-300 p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-8 text-black text-center">Write a Story</h1>
          
          <div className="space-y-6">
            <input placeholder="Story title..." value={form.title} onChange={(e) => setForm({...form, title: e.target.value})}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-lg text-black bg-white focus:border-blue-500 focus:outline-none" />
            
            <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}
              className="w-full p-4 border-2 border-gray-300 rounded-lg text-black bg-white focus:border-blue-500 focus:outline-none">
              <option value="">Choose category (optional)</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            
            <div className="space-y-4">
              <input placeholder="Image URL (optional)..." value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})}
                className="w-full p-4 border-2 border-gray-300 rounded-lg text-black bg-white focus:border-blue-500 focus:outline-none" />
              <div className="text-center text-gray-500">OR</div>
              <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0]; if (file) { setImageFile(file); setForm({...form, imageUrl: ""}); }}}
                className="w-full p-4 border-2 border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:outline-none" />
              {imageFile && <p className="text-sm text-green-600">Selected: {imageFile.name}</p>}
            </div>
            
            <div className="min-h-[400px] border-2 border-gray-300 rounded-lg">
              {isClient && <JoditEditor value={form.content} config={{ placeholder: "Write your story...", buttons: ["bold", "italic", "ul", "ol", "link"], showCharsCounter: false, showWordsCounter: false, showXPathInStatusbar: false }}
               //When the user stops typing, save the text to your form
               onBlur={(content: string) => setForm({...form, content})} />}
            </div>
            
            <div className="flex gap-4 justify-center">
              <button onClick={saveDraft} className="px-6 py-3 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors">Save Draft</button>
              <button onClick={publishPost} disabled={uploading} className="px-8 py-4 bg-black text-white rounded-lg hover:bg-gray-800 font-medium text-lg transition-colors disabled:bg-gray-400">
                {uploading ? "Uploading..." : "Publish Story"}
              </button>
            </div>
          </div>
        </div>
        
        {drafts.length > 0 && (
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border-2 border-gray-300 p-6">
            <h2 className="text-xl font-bold mb-4 text-black">Saved Drafts</h2>
            <div className="space-y-3">
              {drafts.map(draft => (
                <div key={draft.id} className="flex items-center justify-between p-3 border border-gray-300 rounded">
                  <div>
                    <p className="font-medium text-black">{draft.title}</p>
                    <p className="text-sm text-gray-600">{draft.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => loadDraft(draft)} className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Load</button>
                    <button onClick={() => deleteDraft(draft.id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}