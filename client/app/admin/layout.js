"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../../services/authService";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      console.log("Redirecting: User not found or not admin", currentUser);
      router.push("/dashboard"); // Redirect non-admins
      return;
    }
    setUser(currentUser);
  }, []);

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-blue text-white flex flex-col">
        <div className="p-6 text-2xl font-bold tracking-wider border-b border-gray-700">
          <span className="text-white">ADMIN</span>
          <span className="text-brand-gold">PANEL</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link
            href="/admin"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-brand-gold"
          >
            Dashboard
          </Link>
          <Link
            href="/admin/projects"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-brand-gold"
          >
            Projects
          </Link>
          <Link
            href="/admin/posts"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-brand-gold"
          >
            Blog Posts
          </Link>
          <Link
            href="/admin/inquiries"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-brand-gold"
          >
            Inquiries
          </Link>
          <Link
            href="/admin/gallery"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-brand-gold"
          >
            Gallery
          </Link>
          <Link
            href="/admin/users"
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-brand-gold"
          >
            Users
          </Link>
          <div className="pt-4 mt-4 border-t border-gray-700">
            <Link
              href="/"
              className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
            >
              View Site
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              logout();
              router.push("/login");
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
