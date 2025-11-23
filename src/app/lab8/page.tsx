import Link from 'next/link';

export default function Lab8() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-4xl font-bold text-purple-600 mb-8">TypeScript & Quality</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Link 
          href="/lab8/post/1" 
          className="block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-purple-800 mb-2">Typed Components</h2>
          <p className="text-purple-600">View posts with full TypeScript integration and type safety</p>
        </Link>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Quality Features:</h3>
        <p className="text-gray-700">TypeScript types for Post, User, Comment, Tag, ESLint configuration, and testing setup</p>
      </div>
    </div>
  );
}