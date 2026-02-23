"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout: contextLogout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    contextLogout();
    router.push("/login");
  };

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Locations", href: "/locations" },
    { name: "Terrace Range", href: "/terrace-range" },
    { name: "Gallery", href: "/gallery" },
    { name: "Insights", href: "/blog" },
    { name: "Learn", href: "/learn" },
    { name: "Contact Us", href: "/contact" },
  ];

  const home = user?.role === "admin" ? "/admin" : "/dashboard";

  return (
    <nav className="bg-white p-4 text-brand-blue shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <img src="/logo.png" alt="Dual Key Victoria" className="h-16" />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 font-medium text-sm lg:text-base">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${
                isActive(link.href)
                  ? "text-brand-gold font-black border-b-2 border-brand-gold"
                  : "hover:text-brand-gold transition"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-600">
              <Link
                href={home}
                className={`${
                  isActive(home)
                    ? "text-brand-gold font-black"
                    : "hover:text-brand-gold transition font-bold"
                }`}
              >
                Dashboard
              </Link>
              <div className="hidden lg:block text-xs text-gray-400">
                {user.name}
              </div>
              <button
                onClick={handleLogout}
                className="border border-brand-blue px-3 py-1 rounded hover:bg-brand-blue hover:text-white transition text-xs uppercase"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-4 ml-4 items-center">
              <Link
                href="/login"
                className={`${
                  isActive("/login")
                    ? "text-brand-gold font-black"
                    : "hover:text-brand-gold transition border-l border-gray-600 pl-4"
                }`}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-brand-gold text-brand-blue px-4 py-2 rounded-sm font-bold hover:bg-yellow-500 transition shadow-lg text-sm uppercase"
              >
                Enquire
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden focus:outline-none text-brand-gold"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-4 flex flex-col pb-4 border-t border-gray-700 pt-4 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block py-2 border-b border-gray-100 ${
                isActive(link.href)
                  ? "text-brand-gold font-black pl-2 border-l-4 border-brand-gold"
                  : "hover:text-brand-gold"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}

          {user ? (
            <>
              <Link
                href={home}
                className={`block py-2 font-black ${
                  isActive(home) ? "text-brand-gold" : "hover:text-brand-gold"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">User: {user.name}</span>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              <Link
                href="/login"
                className={`block text-center py-2 border border-gray-200 rounded ${
                  isActive("/login")
                    ? "text-brand-gold font-black bg-gray-50"
                    : "text-brand-blue"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block text-center py-3 bg-brand-gold text-brand-blue font-bold rounded-sm shadow-md"
                onClick={() => setIsOpen(false)}
              >
                Enquire Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
