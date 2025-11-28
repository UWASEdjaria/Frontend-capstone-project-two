"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleStartWriting = () => {
    if (!session) {
      router.push('/lab2/login');
    } else {
      router.push('/lab3/editor');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 transition-all duration-300 hover:scale-105">
            Medium
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            A place to write, read, and connect
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/lab3/editor" 
              className="border border-white bg-transparent text-white px-8 py-3 rounded transition-all duration-300 hover:bg-black hover:text-white hover:scale-105"
            >
              Start Writing
            </Link>
            <Link 
              href="/lab4/posts" 
              className="border border-white bg-transparent text-white px-8 py-3 rounded transition-all duration-300 hover:bg-black hover:text-white hover:scale-105"
            >
              Read All Posts
            </Link>
          </div>
        </div>



        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 border border-white rounded transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 className="text-xl font-bold text-white mb-3">✍️ Write</h3>
            <p className="text-white">Share your thoughts with rich text formatting and images</p>
          </div>
          
          <div className="p-6 border border-white rounded transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 className="text-xl font-bold text-white  mb-3">💬 Engage</h3>
            <p className="text-white">Comment and like posts from other writers</p>
          </div>
          
          <div className="p-6 border border-white rounded transition-all duration-300 hover:shadow-lg hover:scale-105">
            <h3 className="text-xl font-bold text-white mb-3">🔍 Discover</h3>
            <p className="text-white">Find interesting content through search and feeds</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">Get Started</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/lab2/signup" 
              className="block p-6 border border-white rounded transition-all duration-300 hover:bg-black hover:scale-105 group"
            >
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white">New to Medium?</h3>
              <p className="text-white group-hover:text-white">Sign up to start writing and engaging with the community</p>
            </Link>
            
            <Link 
              href="/lab2/login" 
              className="block p-6 border border-white rounded transition-all duration-300 hover:bg-black hover:scale-105 group"
            >
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-white">Already have an account?</h3>
              <p className="text-white group-hover:text-white">Log in to continue your writing journey</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
