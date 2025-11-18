import Link from 'next/link';

export default function Lab3() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-4xl font-bold text-orange-600 mb-8">Rich Content Editor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/lab3/editor" 
          className="block p-6 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-orange-800 mb-2">Rich Text Editor</h2>
          <p className="text-orange-600">Create posts with rich formatting, images, and embeds</p>
        </Link>
        
        <Link 
          href="/lab4/posts" 
          className="block p-6 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-orange-800 mb-2">View Posts</h2>
          <p className="text-orange-600">Browse all published posts</p>
        </Link>
      </div>
    </div>
  );
}