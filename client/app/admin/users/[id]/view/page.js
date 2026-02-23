"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { getUserById } from "../../../../../services/authService";

export default function ViewUser({ params }) {
  const { id } = use(params);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const data = await getUserById(id);
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch user");
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );

  if (!user)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-brand-blue uppercase tracking-tight mb-4">
          Partner Not Found
        </h2>
        <Link
          href="/admin/users"
          className="text-brand-gold font-bold uppercase text-xs tracking-widest hover:underline"
        >
          Return to Directory
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header Card */}
      <div className="flex items-center justify-between mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-brand-blue uppercase tracking-tight">
            Partner <span className="text-brand-gold">Intelligence</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Deep inspection of member credentials and network status.
          </p>
        </div>
        <div className="flex gap-4">
          <Link
            href={`/admin/users/${user._id}`}
            className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 transform hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
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
            Modify Partner
          </Link>
          <Link
            href="/admin/users"
            className="bg-gray-100 text-gray-500 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-blue hover:text-white transition-all flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-gray-100">
        {/* Profile Banner */}
        <div className="bg-brand-blue h-48 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-full p-10 flex items-center gap-8">
            <div className="w-24 h-24 rounded-[2rem] bg-white p-1 shadow-2xl">
              <div className="w-full h-full rounded-[1.8rem] bg-gray-50 flex items-center justify-center text-3xl font-black text-brand-blue border border-gray-100">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="mb-2">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter leading-tight">
                {user.name}
              </h2>
              <p className="text-brand-gold font-black uppercase text-[10px] tracking-[0.3em] opacity-80">
                {user.role} Member
              </p>
            </div>
          </div>
        </div>

        <div className="p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Intel Group: Identity */}
            <div className="space-y-8">
              <div className="pb-4 border-b border-gray-50">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  Identity Parameters
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">
                      Electronic Mail
                    </p>
                    <p className="text-lg font-black text-brand-blue lowercase">
                      {user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">
                      Network Role
                    </p>
                    <span
                      className={`inline-flex items-center px-4 py-1 text-[10px] font-black uppercase rounded-full border tracking-widest mt-1 ${
                        user.role === "admin"
                          ? "bg-purple-50 text-purple-600 border-purple-100"
                          : user.role === "associate"
                            ? "bg-brand-gold/10 text-brand-gold border-brand-gold/20"
                            : "bg-gray-50 text-gray-500 border-gray-100"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Intel Group: System */}
            <div className="space-y-8">
              <div className="pb-4 border-b border-gray-50">
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                  System Logistics
                </h3>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">
                      Credential ID
                    </p>
                    <p className="text-xs font-mono text-gray-400 bg-gray-50 p-2 rounded-lg border border-gray-100 inline-block">
                      {user._id}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">
                        Affiliation Date
                      </p>
                      <p className="text-sm font-black text-brand-blue">
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-1">
                        Verification
                      </p>
                      {user.isApproved ? (
                        <span className="text-green-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                          Validated
                        </span>
                      ) : (
                        <span className="text-amber-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-medium italic">
              Advanced partner metrics and activity logs are restricted to
              executive clearance only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
