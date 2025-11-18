"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) router.push("/lab2/profile");
    
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow border border-red-200">
      <h1 className="text-2xl font-bold mb-4 text-orange-500">Login</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 text-gray-600 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 text-gray-600 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-pink-500 text-white p-2 rounded transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}
