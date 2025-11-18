async function getPosts() {
  const res = await fetch("http://localhost:3000/api/lab6/posts", { cache: "no-store" });
  return res.json();
}

export default async function Posts() {
  const posts = await getPosts();

  return (
    <div className="p-6">
      {posts.map((p:any)=>(
        <div key={p.id} className="border p-3 mb-3">
          <h2 className="font-bold">{p.title}</h2>
          <p>{p.content}</p>
        </div>
      ))}
    </div>
  );
}
