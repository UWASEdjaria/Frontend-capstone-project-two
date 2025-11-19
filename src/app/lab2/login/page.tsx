"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.ok) {
      setMessage("Login successful! Redirecting to your profile...");
      setTimeout(() => {
        router.push("/lab2/profile");
      }, 1500);
    } else {
      setMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow border-2 border-black transition-all duration-300 hover:shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-black">Login</h1>
      {message && (
        <div className={`mb-4 p-3 rounded border-2 ${
          message.includes('successful') 
            ? 'border-green-500 bg-green-50 text-green-700' 
            : 'border-red-500 bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 text-black border-2 border-black rounded transition-all duration-300 focus:shadow-md focus:scale-105"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 text-black border-2 border-black rounded transition-all duration-300 focus:shadow-md focus:scale-105"
          required
        />
        <button
          type="submit"
          className="border-2 border-black bg-transparent text-black p-2 rounded transition-all duration-300 hover:bg-black hover:text-white hover:scale-105"
        >
          Login
        </button>
      </form>
    </div>
  );
}
