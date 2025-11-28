import Link from 'next/link';

export default function Lab6() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-4xl font-bold text-purple-600 mb-8">Comments & Social Features</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link 
          href="/lab6/posts" 
          className="block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Posts with Comments</h2>
          <p className="text-purple-600">View posts with commenting system and social interactions</p>
        </Link>
        
        <Link 
          href="/lab6/create-post" 
          className="block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Create Post</h2>
          <p className="text-purple-600">Create new posts with social features enabled</p>
        </Link>
      </div>
    </div>
  );
}