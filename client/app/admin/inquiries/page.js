"use client";

import { useEffect, useState } from "react";
import {
  getInquiries as getAllInquiries,
  deleteInquiry,
} from "../../../services/inquiryService";
import Link from "next/link";
import toast from "react-hot-toast";

import Pagination from "../../../components/Pagination";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries(currentPage);
  }, [currentPage]);

  const fetchInquiries = async (page) => {
    setLoading(true);
    try {
      const data = await getAllInquiries(page, 10);
      setInquiries(data.inquiries);
      setTotalPages(data.pages);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch inquiries");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      try {
        await deleteInquiry(id);
        toast.success("Inquiry deleted successfully");
        fetchInquiries(currentPage);
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete inquiry");
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
            Client <span className="text-brand-gold">Inquiries</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track and manage incoming interest and communications.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Lead Information
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Contact Details
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Date Received
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Status
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {inquiries.map((inquiry) => (
                <tr
                  key={inquiry._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-brand-gold/5 flex items-center justify-center text-brand-gold font-black text-lg shadow-sm border border-brand-gold/10 group-hover:scale-110 transition-transform flex-shrink-0">
                        {inquiry.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-brand-blue font-black uppercase text-sm tracking-tight leading-none mb-1">
                          {inquiry.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-gray-600 font-medium text-sm italic mb-1">
                      {inquiry.email}
                    </p>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      {inquiry.phone}
                    </p>
                  </td>
                  <td className="px-8 py-6 text-gray-500 font-medium text-sm">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-[10px] font-black uppercase rounded-full border tracking-widest ${
                        inquiry.status === "Closed"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : inquiry.status === "Contacted"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                      }`}
                    >
                      {inquiry.status || "New"}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/inquiries/${inquiry._id}`}
                        className="p-2.5 rounded-xl bg-gray-100 text-gray-400 hover:bg-brand-blue hover:text-white transition-all shadow-sm"
                        title="View Inquiry"
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
                      <button
                        onClick={() => handleDelete(inquiry._id)}
                        className="p-2.5 rounded-xl bg-red-100 text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Purge Inquiry"
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

        {inquiries.length > 0 && (
          <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        {inquiries.length === 0 && (
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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-8 5-8-5"
                />
              </svg>
            </div>
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
              No Client Inquiries Identified
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
