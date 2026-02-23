"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getInquiryById,
  updateInquiryStatus,
} from "../../../../services/inquiryService";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function InquiryDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [inquiry, setInquiry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      fetchInquiry();
    }
  }, [id]);

  const fetchInquiry = async () => {
    try {
      const data = await getInquiryById(id);
      setInquiry(data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error("Failed to load inquiry details");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await updateInquiryStatus(id, newStatus);
      setInquiry({ ...inquiry, status: newStatus });
      toast.success("Status updated successfully");
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-gray-700">Inquiry not found</h2>
        <Link
          href="/admin/inquiries"
          className="text-brand-blue hover:underline mt-4 inline-block"
        >
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #inquiry-card, #inquiry-card * {
            visibility: visible;
          }
          #inquiry-card {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: none;
            box-shadow: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `,
        }}
      />
      <div className="mb-6 flex justify-between items-center no-print">
        <h1 className="text-3xl font-bold text-brand-blue">Inquiry Details</h1>
        <Link
          href="/admin/inquiries"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition"
        >
          Back to List
        </Link>
      </div>

      <div
        id="inquiry-card"
        className="bg-white rounded shadow-lg overflow-hidden border border-gray-200"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500 uppercase font-bold tracking-wider">
              Inquiry ID:
            </span>
            <span className="ml-2 text-sm font-mono text-gray-700">
              {inquiry._id}
            </span>
          </div>
          <div className="flex items-center space-x-2 no-print">
            <span className="text-sm font-bold text-gray-600 uppercase">
              Status:
            </span>
            <select
              value={inquiry.status || "New"}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className={`text-sm font-bold py-1 px-3 rounded-full border-none focus:ring-2 focus:ring-brand-blue cursor-pointer
                ${
                  inquiry.status === "Closed"
                    ? "bg-green-100 text-green-800"
                    : inquiry.status === "Contacted"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          {/* Print only status badge (visible only during print) */}
          <div className="hidden print:block">
            <span
              className={`text-sm font-bold py-1 px-3 rounded-full ${
                inquiry.status === "Closed"
                  ? "bg-green-100 text-green-800"
                  : inquiry.status === "Contacted"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {inquiry.status || "New"}
            </span>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Name
              </h3>
              <p className="text-xl font-bold text-brand-blue">
                {inquiry.name}
              </p>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Date Received
              </h3>
              <p className="text-lg text-gray-700">
                {new Date(inquiry.createdAt).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-100">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Email Address
              </h3>
              <a
                href={`mailto:${inquiry.email}`}
                className="text-lg text-brand-blue hover:underline"
              >
                {inquiry.email}
              </a>
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Phone Number
              </h3>
              <div className="text-lg text-gray-700">
                {inquiry.phone || "Not provided"}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
              Message
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 italic text-gray-800 leading-relaxed whitespace-pre-wrap">
              {inquiry.message}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end no-print">
          <button
            onClick={() => window.print()}
            className="text-brand-blue hover:text-blue-800 transition text-sm font-bold flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
              />
            </svg>
            Print This Card
          </button>
        </div>
      </div>
    </div>
  );
}
