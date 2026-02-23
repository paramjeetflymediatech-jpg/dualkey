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
      console.error(error);
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
      console.error(error);
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
      <div className="text-center py-20">
        <h2 className="text-2xl font-black text-brand-blue uppercase tracking-tight mb-4">
          Inquiry Not Found
        </h2>
        <Link
          href="/admin/inquiries"
          className="text-brand-gold font-bold uppercase text-xs tracking-widest hover:underline"
        >
          Return to List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
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

      {/* Header Card */}
      <div className="flex items-center justify-between mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 no-print">
        <div>
          <h1 className="text-3xl font-black text-brand-blue uppercase tracking-tight">
            Inquiry <span className="text-brand-gold">Intelligence</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Detailed inspection of client interest and communique.
          </p>
        </div>
        <Link
          href="/admin/inquiries"
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
          Back to List
        </Link>
      </div>

      <div
        id="inquiry-card"
        className="bg-white rounded-[3rem] shadow-sm overflow-hidden border border-gray-100"
      >
        <div className="bg-gray-50/50 px-10 py-6 border-b border-gray-50 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">
              COMMUNIQUE ID
            </span>
            <span className="ml-4 text-xs font-mono text-brand-blue font-bold">
              {inquiry._id}
            </span>
          </div>
          <div className="flex items-center space-x-4 no-print">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              MANAGEMENT STATUS
            </span>
            <select
              value={inquiry.status || "New"}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className={`text-[10px] font-black uppercase tracking-widest py-2 px-6 rounded-full border shadow-sm outline-none focus:ring-2 focus:ring-brand-blue cursor-pointer transition-all
                ${
                  inquiry.status === "Closed"
                    ? "bg-green-50 text-green-600 border-green-100"
                    : inquiry.status === "Contacted"
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : "bg-amber-50 text-amber-600 border-amber-100"
                }`}
            >
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
          {/* Print only status badge */}
          <div className="hidden print:block font-black text-xs uppercase tracking-widest text-brand-blue">
            STATUS: {inquiry.status || "New"}
          </div>
        </div>

        <div className="p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-brand-gold/10 flex items-center justify-center text-brand-gold font-black text-2xl shadow-sm border border-brand-gold/20">
                {inquiry.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                  Intermediary Name
                </h3>
                <p className="text-2xl font-black text-brand-blue tracking-tight uppercase">
                  {inquiry.name}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">
                Timestamp of Acquisition
              </h3>
              <p className="text-lg font-bold text-gray-700">
                {new Date(inquiry.createdAt).toLocaleString(undefined, {
                  dateStyle: "full",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 pb-12 border-b border-gray-50">
            <div>
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">
                Electronic Mail
              </h3>
              <a
                href={`mailto:${inquiry.email}`}
                className="text-lg font-black text-brand-blue hover:text-brand-gold transition-colors flex items-center gap-2 group"
              >
                <svg
                  className="w-5 h-5 text-gray-300 group-hover:text-brand-gold"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 00-2 2z"
                  />
                </svg>
                {inquiry.email}
              </a>
            </div>
            <div>
              <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-2">
                Telephonic Link
              </h3>
              <div className="text-lg font-black text-gray-700 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {inquiry.phone || "UNSPECIFIED"}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6 border-b border-gray-50 pb-2">
              Transcript of Communique
            </h3>
            <div className="bg-gray-50/50 rounded-3xl p-10 border border-gray-100 italic text-brand-blue font-medium text-lg leading-relaxed whitespace-pre-wrap relative overflow-hidden">
              <svg
                className="absolute top-4 right-4 w-20 h-20 text-gray-100/50 -rotate-12 pointer-events-none"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H13.017V21H14.017ZM6.017 21L6.017 18C6.017 16.8954 6.91243 16 8.017 16H11.017C11.5693 16 12.017 15.5523 12.017 15V9C12.017 8.44772 11.5693 8 11.017 8H8.017C7.46472 8 7.017 8.44772 7.017 9V12C7.017 12.5523 6.5693 13 6.017 13H5.017V21H6.017Z" />
              </svg>
              <span className="relative z-10">{inquiry.message}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 px-10 py-6 border-t border-gray-50 flex justify-end no-print">
          <button
            onClick={() => window.print()}
            className="group bg-white border border-gray-100 text-brand-blue px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-sm hover:shadow-md transition-all flex items-center gap-3"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-300 group-hover:text-brand-gold transition-colors"
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
            Print Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
