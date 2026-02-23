"use client";

import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProjects: 0,
    pendingRequests: 0,
    totalInquiries: 0,
    latestUsers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard stats error", err);
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Premium Header */}
      <div className="mb-12 bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl font-black text-brand-blue uppercase tracking-tight leading-none mb-2">
            Executive{" "}
            <span className="text-brand-gold font-light">Overview</span>
          </h1>
          <p className="text-gray-400 font-medium italic">
            Command Center for Premium Real Estate Assets & Partners
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue color-white flex items-center justify-center opacity-5 -mr-20 -mt-20 rounded-full">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
          </svg>
        </div>
      </div>

      {/* Dynamic Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-brand-blue transition-all">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue mb-4 transition-transform group-hover:scale-110">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Total Network
            </h2>
            <p className="text-3xl font-black text-brand-blue tracking-tight">
              {stats.totalUsers}
            </p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-brand-gold transition-all">
          <div className="w-12 h-12 rounded-2xl bg-brand-gold/5 flex items-center justify-center text-brand-gold mb-4 transition-transform group-hover:scale-110">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Managed Assets
            </h2>
            <p className="text-3xl font-black text-brand-blue tracking-tight">
              {stats.totalProjects}
            </p>
          </div>
        </div>

        <Link
          href="/admin/access"
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-amber-500 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 mb-4 transition-transform group-hover:scale-110 relative">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            {stats.pendingRequests > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </div>
          <div>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Gatekeeper Auth
            </h2>
            <p className="text-3xl font-black text-brand-blue tracking-tight">
              {stats.pendingRequests}{" "}
              <span className="text-xs text-amber-600 font-bold uppercase ml-2 tracking-tighter">
                Pending
              </span>
            </p>
          </div>
        </Link>

        <Link
          href="/admin/inquiries"
          className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col justify-between group hover:border-green-500 transition-all"
        >
          <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-4 transition-transform group-hover:scale-110">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Lead Pipeline
            </h2>
            <p className="text-3xl font-black text-brand-blue tracking-tight">
              {stats.totalInquiries || 0}
            </p>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Registrations Column */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-brand-blue uppercase tracking-tight">
              Recent <span className="text-brand-gold">Partners</span>
            </h2>
            <Link
              href="/admin/users"
              className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-brand-blue transition-colors"
            >
              See Directory
            </Link>
          </div>
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {stats.latestUsers && stats.latestUsers.length > 0 ? (
              stats.latestUsers.map((u, index) => (
                <div
                  key={index}
                  className="p-8 flex items-center justify-between group hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-black text-xl shadow-sm border border-brand-blue/10 group-hover:scale-110 transition-transform flex-shrink-0">
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-brand-blue font-black uppercase text-sm tracking-tight leading-none mb-1">
                        {u.name}
                      </p>
                      <p className="text-gray-400 font-medium text-xs italic">
                        {u.email}
                      </p>
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4">
                    <span
                      className={`px-3 py-1 text-[10px] font-black uppercase rounded-full border tracking-widest ${
                        u.role === "admin"
                          ? "bg-purple-50 text-purple-600 border-purple-100"
                          : u.role === "associate"
                            ? "bg-brand-gold/10 text-brand-gold border-brand-gold/20"
                            : "bg-gray-50 text-gray-500 border-gray-100"
                      }`}
                    >
                      {u.role}
                    </span>
                    <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-200">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <p className="text-gray-300 font-black uppercase text-[10px] tracking-widest">
                  No registrations found
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div>
          <h2 className="text-2xl font-black text-brand-blue uppercase tracking-tight mb-8">
            Asset <span className="text-brand-gold">Control</span>
          </h2>
          <div className="flex flex-col gap-4">
            <Link
              href="/admin/projects"
              className="bg-brand-blue text-white p-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 transform hover:-translate-y-1 transition-all flex items-center justify-between group"
            >
              Deploy New Asset
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </Link>
            <Link
              href="/admin/posts"
              className="bg-white border border-gray-100 p-6 rounded-[2rem] font-black uppercase text-xs text-brand-blue tracking-[0.2em] shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
            >
              Market Newsletter
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>
            <Link
              href="/admin/brochures"
              className="bg-brand-gold text-brand-blue p-6 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-brand-gold/20 hover:shadow-brand-gold/40 transform hover:-translate-y-1 transition-all flex items-center justify-between group"
            >
              Asset Collateral
              <svg
                className="w-5 h-5 transition-transform group-hover:rotate-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
