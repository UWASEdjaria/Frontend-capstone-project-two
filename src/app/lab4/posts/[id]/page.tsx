"use client";

import { useEffect, useState } from "react";

export default function Post({ params }: { params: { id: string } }) {
  const [p, setP] = useState<any>(null);
  useEffect(() => { fetch(`/lab4/api/post/${params.id}`).then(r => r.json()).then(setP) }, [params.id]);
  if (!p) return <p>Loading...</p>;
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-[#ff4d6d]">{p.title}</h1>
      <p className="text-gray-700 mb-4">By {p.author.name}</p>
      <div dangerouslySetInnerHTML={{ __html: p.content }} />
    </div>
  );
}
