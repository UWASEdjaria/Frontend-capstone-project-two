import Link from 'next/link';

export default function Lab9() {
  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h1 className="text-4xl font-bold text-purple-600 mb-8">SEO, Performance & SSG/SSR</h1>
      
      <div className="grid grid-cols-1 gap-6">
        <Link 
          href="/lab9/profile/1" 
          className="block p-6 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <h2 className="text-xl font-semibold text-purple-800 mb-2">User Profile</h2>
          <p className="text-purple-600">View optimized user profiles with follow functionality and SEO metadata</p>
        </Link>
      </div>
      
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Performance Features:</h3>
        <p className="text-gray-700">SSG/SSR implementation, Open Graph tags, image optimization, and performance monitoring</p>
      </div>
    </div>
  );
}