"use client";
import { useState, useRef } from "react";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function Editor() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [drafts, setDrafts] = useState<any[]>([]);
  const [preview, setPreview] = useState(false);
  const editor = useRef(null);

  const config = {
    readonly: false,
    placeholder: "Start typing...",
    buttons: ["bold", "italic", "underline", "|", "ul", "ol", "|", "link", "image", "|", "source"]
  };

  const saveDraft = () => {
    const draft = { id: Date.now(), title: title || "Untitled", content, date: new Date().toLocaleDateString() };
    setDrafts([draft, ...drafts]);
    alert("Draft saved!");
  };

  const loadDraft = (draft: any) => {
    setTitle(draft.title);
    setContent(draft.content);
    setPreview(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-orange-500">Rich Text Editor</h1>
      
      <div className="mb-4 flex gap-2">
        <button onClick={() => setPreview(!preview)} className="px-4 py-2 bg-orange-500 text-white rounded">
          {preview ? "Edit" : "Preview"}
        </button>
        <button onClick={saveDraft} className="px-4 py-2 border border-orange-500 text-orange-500 rounded">
          Save Draft
        </button>
      </div>

      {!preview ? (
        <div>
          <input
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-2 mb-4 border rounded text-lg"
          />
          <JoditEditor
            ref={editor}
            value={content}
            config={config}
            onBlur={newContent => setContent(newContent)}
          />
        </div>
      ) : (
        <div className="border p-4 rounded">
          <h2 className="text-xl font-bold mb-4">{title || "Untitled"}</h2>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}

      {drafts.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Drafts</h3>
          {drafts.map(draft => (
            <div key={draft.id} className="p-2 border rounded mb-2 flex justify-between">
              <span>{draft.title} - {draft.date}</span>
              <button onClick={() => loadDraft(draft)} className="text-orange-500">Load</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}