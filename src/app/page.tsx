import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-black mb-6 transition-all duration-300 hover:scale-105">
            Medium
          </h1>
          <p className="text-xl text-black mb-8">
            A place to write, read, and connect
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/lab3/editor" 
              className="border-2 border-black bg-transparent text-black px-8 py-3 rounded transition-all duration-300 hover:bg-black hover:text-white hover:scale-105"
            >
              Start Writing
            </Link>
            <Link 
              href="/lab4/posts" 
              className="border-2 border-black bg-transparent text-black px-8 py-3 rounded transition-all duration-300 hover:bg-black hover:text-white hover:scale-105"
            >
              Read Posts
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border-2 border-black rounded transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 className="text-xl font-bold text-black mb-3">✍️ Write</h3>
            <p className="text-black">Share your thoughts with rich text formatting and images</p>
          </div>
          
          <div className="p-6 border-2 border-black rounded transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 className="text-xl font-bold text-black mb-3">💬 Engage</h3>
            <p className="text-black">Comment and like posts from other writers</p>
          </div>
          
          <div className="p-6 border-2 border-black rounded transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 className="text-xl font-bold text-black mb-3">🔍 Discover</h3>
            <p className="text-black">Find interesting content through search and feeds</p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-black mb-8">Get Started</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/lab2/signup" 
              className="block p-6 border-2 border-black rounded transition-all duration-300 hover:bg-black hover:scale-105 group"
            >
              <h3 className="text-xl font-bold text-black mb-2 group-hover:text-white">New to Medium?</h3>
              <p className="text-black group-hover:text-white">Sign up to start writing and engaging with the community</p>
            </Link>
            
            <Link 
              href="/lab2/login" 
              className="block p-6 border-2 border-black rounded transition-all duration-300 hover:bg-black hover:scale-105 group"
            >
              <h3 className="text-xl font-bold text-black mb-2 group-hover:text-white">Already have an account?</h3>
              <p className="text-black group-hover:text-white">Log in to continue your writing journey</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}