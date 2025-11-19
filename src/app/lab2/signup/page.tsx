"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/lab2/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      setMessage("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/lab2/login");
      }, 1500);
    } else {
      const data = await res.json();
      setMessage(data.error || "Signup failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow border-2 border-black transition-all duration-300 hover:shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-black">Sign Up</h1>
      {message && (
        <div className={`mb-4 p-3 rounded border-2 ${
          message.includes('successfully') 
            ? 'border-green-500 bg-green-50 text-green-700' 
            : 'border-red-500 bg-red-50 text-red-700'
        }`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 text-black border-2 border-black rounded transition-all duration-300 focus:shadow-md focus:scale-105"
          required
        />
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
          Sign Up
        </button>
        
      </form>
    </div>
  );
}
