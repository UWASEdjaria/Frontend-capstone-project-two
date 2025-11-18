"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hashedPassword = await bcrypt.hash(password, 10);

    const res = await fetch("/api/lab2/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: hashedPassword }),
    });

    if (res.ok) router.push("/lab2/login");
    router.push("/lab2/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow border-2 border-black transition-all duration-300 hover:shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-black">Sign Up</h1>
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
