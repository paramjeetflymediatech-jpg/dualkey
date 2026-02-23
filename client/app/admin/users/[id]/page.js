"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { getUserById, updateUser } from "@/services/authService";

export default function EditUser({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "customer",
    password: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const data = await getUserById(id);
      setFormData({
        name: data.name,
        email: data.email,
        role: data.role,
        password: "",
      });
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch user intelligence");
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dataToSend = { ...formData };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      await updateUser(id, dataToSend);
      toast.success("Intelligence updated successfully");
      router.push("/admin/users");
    } catch (err) {
      const msg = err.response?.data?.message || "Modification failed.";
      toast.error(msg);
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Header Card */}
      <div className="flex items-center justify-between mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-brand-blue uppercase tracking-tight">
            Modify <span className="text-brand-gold">Credential</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Reconfigure partner identity, network role, or security parameters.
          </p>
        </div>
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
          Discard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-gray-400 font-black uppercase text-[10px] tracking-widest mb-3">
                Legal Identity / Descriptor
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-black uppercase text-xs text-brand-blue tracking-widest outline-none focus:border-brand-blue transition-all"
                value={formData.name}
                onChange={handleChange}
                placeholder="NAME..."
              />
            </div>

            <div>
              <label className="block text-gray-400 font-black uppercase text-[10px] tracking-widest mb-3">
                Communication Endpoint (Email)
              </label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-black text-xs text-brand-blue tracking-widest outline-none focus:border-brand-blue transition-all"
                value={formData.email}
                onChange={handleChange}
                placeholder="EMAIL..."
              />
            </div>

            <div>
              <label className="block text-gray-400 font-black uppercase text-[10px] tracking-widest mb-3">
                Network Tier / Role
              </label>
              <div className="relative group">
                <select
                  name="role"
                  className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-black uppercase text-xs text-brand-blue tracking-widest outline-none focus:border-brand-blue appearance-none cursor-pointer transition-all"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="customer">Customer</option>
                  <option value="associate">Associate</option>
                  <option value="admin">Administrator</option>
                </select>
                <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none text-gray-300 group-hover:text-brand-gold transition-colors">
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <div className="p-6 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                <label className="block text-brand-blue/60 font-black uppercase text-[10px] tracking-widest mb-3">
                  Credential Override (Optional)
                </label>
                <input
                  type="password"
                  name="password"
                  className="w-full bg-white border border-gray-100 px-6 py-4 rounded-2xl font-black text-xs text-brand-blue tracking-widest outline-none focus:border-brand-blue transition-all"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="NEW PASSCODE (OR LEAVE BLANK)"
                />
                <p className="mt-3 text-[10px] text-gray-400 font-medium italic">
                  Leave field empty to maintain current encryption parameters.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="sticky bottom-8 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-2xl flex items-center justify-end z-50">
          <button
            type="submit"
            disabled={submitting}
            className="w-full md:w-auto bg-brand-blue text-white px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 transform hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {submitting ? "Committing..." : "Commit Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
