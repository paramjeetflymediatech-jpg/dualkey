"use client";

import { useEffect, useState } from "react";
import { getInquiries as getAllInquiries } from "../../../services/inquiryService";
import Link from "next/link";

import Pagination from "../../../components/Pagination";

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchInquiries(currentPage);
  }, [currentPage]);

  const fetchInquiries = async (page) => {
    try {
      const data = await getAllInquiries(page, 10);
      setInquiries(data.inquiries);
      setTotalPages(data.pages);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-brand-blue">Inquiries</h1>

      <div className="bg-white rounded shadow overflow-hidden border border-gray-200">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry._id} className="hover:bg-gray-50 transition">
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap font-bold">
                    {inquiry.name}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {inquiry.email}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-500 text-xs">{inquiry.phone}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span
                    className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                      inquiry.status === "Closed"
                        ? "text-green-900"
                        : inquiry.status === "Contacted"
                          ? "text-blue-900"
                          : "text-yellow-900"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`absolute inset-0 opacity-50 rounded-full ${
                        inquiry.status === "Closed"
                          ? "bg-green-200"
                          : inquiry.status === "Contacted"
                            ? "bg-blue-200"
                            : "bg-yellow-200"
                      }`}
                    ></span>
                    <span className="relative">{inquiry.status || "New"}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                  <Link
                    href={`/admin/inquiries/${inquiry._id}`}
                    className="bg-brand-blue hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded text-xs transition"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {inquiries.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
        {inquiries.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No inquiries found.
          </div>
        )}
      </div>
    </div>
  );
}
