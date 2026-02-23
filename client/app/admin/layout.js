"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCurrentUser, logout } from "../../services/authService";
import toast from "react-hot-toast";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "admin") {
      toast.error("You are not authorized to access this page");
      router.push("/dashboard"); // Redirect non-admins
      return;
    }
    setUser(currentUser);
  }, []);

  const isActive = (path) => {
    if (path === "/admin") return pathname === "/admin";
    return pathname.startsWith(path);
  };

  const adminLinks = [
    { name: "Dashboard", href: "/admin" },
    { name: "Projects", href: "/admin/projects" },
    { name: "Blog Posts", href: "/admin/posts" },
    { name: "Inquiries", href: "/admin/inquiries" },
    { name: "Gallery", href: "/admin/gallery" },
    { name: "Brochures", href: "/admin/brochures" },
    { name: "Users", href: "/admin/users" },
    { name: "Access Requests", href: "/admin/access" },
  ];

  if (!user) return null;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-blue text-white flex flex-col shadow-xl">
        <div className="p-6 text-2xl font-bold tracking-wider border-b border-gray-700">
          <span className="text-white font-light">ADMIN</span>
          <span className="text-brand-gold ml-1">PANEL</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-3 px-4 rounded-xl transition duration-200 ${
                isActive(link.href)
                  ? "bg-brand-gold text-brand-blue font-black shadow-lg scale-[1.02]"
                  : "text-gray-300 hover:bg-white/10 hover:text-brand-gold"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-700">
            <Link
              href="/"
              className="block py-2.5 px-4 rounded-xl text-gray-400 transition duration-200 hover:bg-white/10 hover:text-white"
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
            className="w-full bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white border border-red-600/50 py-2.5 rounded-xl font-bold transition duration-200"
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
