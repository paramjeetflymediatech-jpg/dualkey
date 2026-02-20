"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../../services/authService";

import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await login({ email, password });
      toast.success("Login successful");
      window.location.href = "/dashboard";
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error(
          "Your account is pending admin approval. Please wait for verification.",
        );
      } else {
        toast.error("Invalid credentials");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-xl border-t-4 border-brand-gold">
        <h2 className="text-3xl font-bold mb-8 text-center text-brand-blue tracking-wide">
          Login to DualKey
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-brand-blue text-white py-3 rounded-sm font-bold text-lg hover:bg-opacity-90 transition duration-200 uppercase tracking-wide"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-brand-blue font-bold hover:underline"
          >
            Register for access
          </a>
        </p>
      </div>
    </div>
  );
}
