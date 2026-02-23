"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "../../../services/authService";
import toast from "react-hot-toast";

import Pagination from "../../../components/Pagination";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const data = await getAllUsers(page, 10);
      // Filter out admins from the main list if needed, or keep them.
      // Usually admins want to see everyone.
      setUsers(data.users);
      setTotalPages(data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch users");
      toast.error("Failed to fetch users");
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id);
        toast.success("User purged from registry");
        fetchUsers(currentPage);
      } catch (error) {
        console.error("Failed to delete user");
        toast.error("Process failed");
      }
    }
  };

  const handleApprove = async (user) => {
    if (window.confirm(`Authorize Access for ${user.name}?`)) {
      try {
        let res = await updateUser(user._id, { isApproved: true });
        if (res.isApproved) {
          toast.success("Credential authorized");
        }
        fetchUsers(currentPage);
      } catch (error) {
        console.error("Failed to approve user");
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Card */}
      <div className="flex items-center justify-between mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-brand-blue uppercase tracking-tight">
            Partner <span className="text-brand-gold">Directory</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Governance of administrators, associates, and verified members.
          </p>
        </div>
        <Link
          href="/admin/users/add"
          className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 transform hover:-translate-y-1 transition-all flex items-center gap-3"
        >
          <svg
            className="w-5 h-5"
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
          Register Partner
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Identity & Profile
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Classification
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Verification Status
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-black text-xl shadow-sm border border-brand-blue/10 group-hover:scale-110 transition-transform flex-shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-brand-blue font-black uppercase text-sm tracking-tight leading-none mb-1">
                          {user.name}
                        </p>
                        <p className="text-gray-400 font-medium text-xs italic">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-[10px] font-black uppercase rounded-full border tracking-widest ${
                        user.role === "admin"
                          ? "bg-purple-50 text-purple-600 border-purple-100"
                          : user.role === "associate"
                            ? "bg-brand-gold/10 text-brand-gold border-brand-gold/20"
                            : "bg-gray-50 text-gray-500 border-gray-100"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      {user.isApproved ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600 text-[10px] font-black uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                          Authenticated
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-amber-600 text-[10px] font-black uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                          Unverified
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      {!user.isApproved && (
                        <button
                          onClick={() => handleApprove(user)}
                          className="p-2.5 rounded-xl bg-green-100 text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                          title="Authorize Partner"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      )}
                      <Link
                        href={`/admin/users/${user._id}/view`}
                        className="p-2.5 rounded-xl bg-gray-100 text-gray-400 hover:bg-brand-blue hover:text-white transition-all shadow-sm"
                        title="Inspect Intelligence"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/users/${user._id}`}
                        className="p-2.5 rounded-xl bg-blue-100 text-blue-400 hover:bg-blue-400 hover:text-white transition-all shadow-sm"
                        title="Modify Partner"
                      >
                        <svg
                          className="w-5 h-5"
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
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2.5 rounded-xl bg-red-100 text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Purge Partner"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length > 0 && (
          <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {users.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto text-gray-300">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
              No Partners Identified in Directory
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
