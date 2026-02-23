"use client";

import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import {
  getAllProjects,
  requestAccess,
  getAccessRequests,
  approveAccess,
} from "../../services/projectService";
import { getAllUsers } from "../../services/authService";
import { AuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setProjects([]);
    setRequests([]);
    setUsers([]);
    try {
      const projectsData = await getAllProjects();
      setProjects(projectsData.projects);

      if (user?.role === "admin") {
        const requestsData = await getAccessRequests();
        setRequests(requestsData);

        const usersData = await getAllUsers(1, 5, "admin");
        setUsers(usersData.users);
      }
    } catch (error) {
      console.error("Dashboard data fetch failed", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAccess = async (projectId) => {
    try {
      await requestAccess(projectId);
      toast.success("Access requested successfully");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to request access");
    }
  };

  const handleApproveAccess = async (requestId) => {
    try {
      await approveAccess(requestId);
      toast.success("Access approved");
      fetchDashboardData();
    } catch (error) {
      toast.error("Failed to approve access");
    }
  };

  const approvedCount = projects.filter(
    (p) => p.accessStatus === "approved",
  ).length;
  const pendingCount = projects.filter(
    (p) => p.accessStatus === "pending",
  ).length;

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-brand-blue text-white pt-32 pb-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/5 rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <span className="text-brand-gold font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
                Investor Hub
              </span>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-2">
                Welcome,{" "}
                <span className="text-brand-gold">
                  {user?.name || "Member"}
                </span>
              </h1>
              <p className="text-gray-400 font-medium italic">
                Manage your portfolio and dual-key access privileges.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-[2rem] flex items-center gap-6">
              <div className="w-14 h-14 bg-brand-gold text-brand-blue rounded-2xl flex items-center justify-center font-black text-xl shadow-lg shadow-brand-gold/20">
                {user?.role?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                  Account Type
                </p>
                <p className="text-lg font-black uppercase tracking-tighter">
                  {user?.role || "User"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 -mt-10 mb-24 relative z-20">
        {/* Metrics Grid */}
        {/* Pending Requests (Admin Only) */}
        {user?.role === "admin" && requests.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Total Assets
                </p>
                <p className="text-4xl font-black text-brand-blue">
                  {projects.length}
                </p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Approved Access
                </p>
                <p className="text-4xl font-black text-green-500">
                  {approvedCount}
                </p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                  Pending Requests
                </p>
                <p className="text-4xl font-black text-brand-gold">
                  {pendingCount}
                </p>
              </div>
              <div className="bg-brand-gold p-8 rounded-[2.5rem] shadow-xl shadow-brand-gold/20 flex flex-col justify-center">
                <p className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-2">
                  Status
                </p>
                <p className="text-xl font-black text-brand-blue uppercase">
                  Verified Partner
                </p>
              </div>
            </div>
            <div className="mb-24">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-black text-brand-blue uppercase tracking-tight">
                  Active Inquiries
                </h2>
                <span className="h-[2px] flex-1 bg-gray-200"></span>
                <span className="bg-brand-gold text-brand-blue text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                  Action Required
                </span>
              </div>
              <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {requests.map((req, index) => (
                    <div
                      key={index}
                      className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 font-bold">
                          {req?.User?.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-lg font-black text-brand-blue uppercase leading-none mb-1">
                            {req.User.name}
                          </p>
                          <p className="text-sm text-gray-500 font-medium italic">
                            {req.User.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 md:text-center">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                          Target Asset
                        </p>
                        <p className="font-bold text-brand-blue">
                          {req.Project.title}
                        </p>
                      </div>
                      <button
                        onClick={() => handleApproveAccess(req._id)}
                        className="bg-brand-blue text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-gold hover:text-brand-blue transition-all"
                      >
                        Authorize Access
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Recent Partners (Admin Only) */}
            <div className="mb-24">
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-black text-brand-blue uppercase tracking-tight">
                  Recent Partners
                </h2>
                <span className="h-[2px] flex-1 bg-gray-200"></span>
                <span className="bg-brand-blue text-white text-[10px] font-black px-4 py-1 rounded-full uppercase tracking-widest">
                  Latest Registrations
                </span>
              </div>
              <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {users.length > 0 ? (
                    users.map((u) => (
                      <div
                        key={u._id}
                        className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-6">
                          <div className="w-14 h-14 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-black text-xl shadow-sm border border-brand-blue/10 group-hover:scale-110 transition-transform flex-shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-lg font-black text-brand-blue uppercase leading-none mb-1">
                              {u.name}
                            </p>
                            <p className="text-sm text-gray-400 font-medium italic">
                              {u.email}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                              u.role === "admin"
                                ? "bg-purple-50 text-purple-600 border-purple-100"
                                : u.role === "associate"
                                  ? "bg-brand-gold/10 text-brand-gold border-brand-gold/20"
                                  : "bg-gray-50 text-gray-500 border-gray-100"
                            }`}
                          >
                            {u.role}
                          </span>
                          <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Link
                          href={`/admin/users/${u._id}/view`}
                          className="bg-gray-100 text-brand-blue px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-blue hover:text-white transition-all text-center"
                        >
                          View Profile
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center text-gray-400 italic">
                      No recent registrations found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Available Projects */}
        <div className="space-y-12">
          <div className="flex items-center hidden gap-4">
            <h2 className="text-2xl font-black text-brand-blue uppercase tracking-tight">
              Available Assets
            </h2>
            <span className="h-[2px] flex-1 bg-gray-200"></span>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col group hover:-translate-y-2 transition-transform duration-500"
                >
                  <div className="p-8 flex-grow">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-black text-brand-blue uppercase tracking-tighter leading-none group-hover:text-brand-gold transition-colors">
                        {project.title}
                      </h3>
                      <span className="bg-gray-50 text-gray-400 text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-gray-100">
                        {project.category || "Standard"}
                      </span>
                    </div>

                    <p className="text-gray-500 text-sm italic line-clamp-2 mb-8 border-l-2 border-brand-gold/20 pl-4">
                      {project.description}
                    </p>

                    <div className="space-y-2">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Current Valuation
                      </p>
                      <p className="text-2xl font-black text-brand-blue">
                        {project.priceRange &&
                        (project.priceRange.min || project.priceRange.max)
                          ? `${project.priceRange.min ? `$${project.priceRange.min.toLocaleString()}` : ""} ${project.priceRange.min && project.priceRange.max ? "-" : ""} ${project.priceRange.max ? `$${project.priceRange.max.toLocaleString()}` : ""}`
                          : project.hasAccess || !project.associateOnly
                            ? "POA"
                            : "RESTRICTED"}
                      </p>
                    </div>
                  </div>

                  <div className="p-8 bg-gray-50 border-t border-gray-100">
                    {user.role === "associate" && project.associateOnly && (
                      <div className="mb-4">
                        {project.accessStatus === "approved" ? (
                          <div className="w-full bg-green-50 text-green-600 text-[10px] font-black uppercase text-center py-3 rounded-2xl border border-green-100 tracking-[0.2em]">
                            Authenticated Partner
                          </div>
                        ) : project.accessStatus === "pending" ? (
                          <div className="w-full bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase text-center py-3 rounded-2xl border border-brand-gold/20 tracking-[0.2em]">
                            Authorization Pending
                          </div>
                        ) : project.accessStatus === "rejected" ? (
                          <div className="w-full bg-red-50 text-red-600 text-[10px] font-black uppercase text-center py-3 rounded-2xl border border-red-100 tracking-[0.2em]">
                            Access Restricted
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRequestAccess(project._id)}
                            className="w-full bg-brand-blue text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-brand-gold hover:text-brand-blue transition-all shadow-lg shadow-brand-blue/10"
                          >
                            Request Partner Access
                          </button>
                        )}
                      </div>
                    )}

                    {(!project.associateOnly ||
                      project.hasAccess ||
                      project.accessStatus === "approved") && (
                      <button
                        onClick={() => router.push(`/projects/${project.slug}`)}
                        className="w-full bg-white text-brand-blue border-2 border-brand-blue/10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:border-brand-gold hover:text-brand-gold transition-all"
                      >
                        Explore Asset Insight
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
