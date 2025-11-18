import Link from 'next/link';

export default function Post() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-4xl font-bold text-purple-600 mb-8">Content Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/lab4/create" 
          className="block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Create New Post</h2>
          <p className="text-purple-600">Write and publish new blog posts with rich content and images</p>
        </Link>
        
        <Link 
          href="/lab4/posts" 
          className="block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-purple-800 mb-2">View All Posts</h2>
          <p className="text-purple-600">Browse and manage all published posts</p>
        </Link>
      </div>

    </div>
  );
}