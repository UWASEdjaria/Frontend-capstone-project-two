import Link from 'next/link';

export default function Lab7() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-4xl font-bold text-purple-600 mb-8">State Management & Data Fetching</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Link 
          href="/lab7/post/1" 
          className="block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Post with Reactions</h2>
          <p className="text-purple-600">View posts with optimized state management and like/clap functionality</p>
        </Link>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Features:</h3>
        <p className="text-gray-700">React Query for data fetching, Context API for global state, optimistic UI updates</p>
      </div>
    </div>
  );
}