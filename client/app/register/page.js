"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../services/authService";

import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register({ name, email, password, role });
      if (response.isApproved === false) {
        toast.success(
          "Registration successful! Pending admin approval. You will notify once approved.",
        );
      } else {
        toast.success("Registration successful! Logging in...");
      }
      router.push("/login");
    } catch (error) {
      toast.error("Registration failed. Email might be taken.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-100px)] items-center justify-center bg-gray-50 pt-20 pb-10">
        <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-xl border-t-4 border-brand-gold">
          <h2 className="text-3xl font-bold mb-8 text-center text-brand-blue tracking-wide">
            Create Account
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
            <div className="mb-6">
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
            <div className="mb-8">
              <label className="block text-gray-700 font-medium mb-2">
                I am an...
              </label>
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent transition"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="customer">Investor / Home Buyer</option>
                <option value="associate">Real Estate Associate</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-brand-blue text-white py-3 rounded-sm font-bold text-lg hover:bg-opacity-90 transition duration-200 uppercase tracking-wide"
            >
              Register
            </button>
          </form>
          <p className="mt-6 text-center text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-brand-blue font-bold hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}
