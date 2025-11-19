"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Profile() {
  const { data: session, status } = useSession();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (status === "loading") return <div className="max-w-md mx-auto mt-10 text-black">Loading...</div>;
  if (!session) return <div className="max-w-md mx-auto mt-10 text-black">You must be logged in to view this page.</div>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow border-2 border-black transition-all duration-300 hover:shadow-lg">
      {showWelcome && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-500 rounded text-center">
          <h2 className="text-xl font-bold text-green-700 mb-2">🎉 Welcome back!</h2>
          <p className="text-green-600">Hello {session.user?.name || 'User'}, great to see you again!</p>
        </div>
      )}
      
      <h1 className="text-2xl font-bold mb-6 text-black">Your Profile</h1>
      
      <div className="space-y-4">
        <div className="p-3 border-2 border-black rounded">
          <p className="text-black"><strong>Name:</strong> {session.user?.name || 'Not provided'}</p>
        </div>
        <div className="p-3 border-2 border-black rounded">
          <p className="text-black"><strong>Email:</strong> {session.user?.email}</p>
        </div>
      </div>
      
      <button
        onClick={() => signOut({ callbackUrl: "/lab2/login" })}
        className="mt-6 w-full border-2 border-black bg-transparent text-black p-2 rounded transition-all duration-300 hover:bg-black hover:text-white hover:scale-105"
      >
        Logout
      </button>
    </div>
  );
}
