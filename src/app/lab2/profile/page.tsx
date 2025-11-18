"use client";

import { useSession, signOut } from "next-auth/react";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p className="text-red-500">You must be logged in to view this page.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow border border-red-200">
      <h1 className="text-2xl font-bold mb-4 text-red-500">Profile</h1>
      <p><strong>Name:</strong> {session.user?.name}</p>
      <p><strong>Email:</strong> {session.user?.email}</p>
      <button
        onClick={() => signOut({ callbackUrl: "/lab2/login" })}
        className="mt-4 bg-red-500 hover:bg-pink-500 text-white p-2 rounded transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
