"use client";

import { useEffect, useState } from "react";
import api from "../../../services/api";
import toast from "react-hot-toast";

export default function AccessRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/access/requests");
      setRequests(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch requests");
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/access/${id}/approve`);
      toast.success("Access approved");
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to approve access");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    try {
      await api.delete(`/access/${id}`);
      toast.success("Request removed");
      fetchRequests();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to delete request");
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
            Access <span className="text-brand-gold">Requests</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Review and authorize partner access to premium property assets.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Partner Member
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Requested Asset
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Status
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Request Date
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-black text-lg shadow-sm border border-brand-blue/10 group-hover:scale-110 transition-transform flex-shrink-0">
                          {request.User?.name?.charAt(0).toUpperCase() || "N"}
                        </div>
                        <div>
                          <p className="text-brand-blue font-black uppercase text-sm tracking-tight leading-none mb-1">
                            {request.User?.name || "N/A"}
                          </p>
                          <p className="text-gray-400 font-medium text-xs italic">
                            {request.User?.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-brand-blue font-black uppercase text-sm tracking-tight leading-none">
                        {request.Project?.title || "N/A"}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-full border border-amber-100 tracking-widest">
                        {request.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-gray-500 font-medium text-sm">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="p-2.5 rounded-xl bg-green-100 text-green-600 hover:bg-green-500 hover:text-white transition-all shadow-sm"
                          title="Authorize Access"
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
                        <button
                          onClick={() => handleDelete(request.id)}
                          className="p-2.5 rounded-xl bg-red-100 text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Purge Request"
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-20 text-center space-y-4">
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
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
                      No Access Requests Identified
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
