"use client";

import { useEffect, useState } from "react";
import {
  getAllBrochures,
  createBrochure,
  deleteBrochure,
} from "../../../services/brochureService";
import toast from "react-hot-toast";
import { image_url } from "../../../services/contentService";

export default function AdminBrochures() {
  const [brochures, setBrochures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    file: null,
    thumbnail: null,
    category: "General",
  });

  useEffect(() => {
    fetchBrochures();
  }, []);

  const fetchBrochures = async () => {
    setLoading(true);
    try {
      const data = await getAllBrochures();
      setBrochures(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch brochures");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed for brochures!");
      e.target.value = "";
      return;
    }
    setFormData({ ...formData, file });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          "Only JPEG, JPG, and PNG images are allowed for thumbnails!",
        );
        e.target.value = "";
        return;
      }
      setFormData({ ...formData, thumbnail: file });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.file) return toast.error("Please select a PDF file");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("file", formData.file);
    if (formData.thumbnail) {
      data.append("thumbnail", formData.thumbnail);
    }

    setUploading(true);
    try {
      await createBrochure(data);
      toast.success("Brochure uploaded successfully!");
      setFormData({
        title: "",
        file: null,
        thumbnail: null,
        category: "General",
      });
      fetchBrochures();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload brochure");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this brochure?")) {
      try {
        await deleteBrochure(id);
        toast.success("Brochure deleted");
        fetchBrochures();
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete brochure");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Card */}
      <div className="flex items-center justify-between mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-brand-blue uppercase tracking-tight">
            Asset <span className="text-brand-gold">Collateral</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage premium investment guides and property brochures.
          </p>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-12">
        <h2 className="text-xl font-black text-brand-blue uppercase tracking-tight mb-8">
          Upload New Brochure
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-end">
            <div>
              <label className="block text-gray-400 font-black uppercase text-[10px] tracking-widest mb-3">
                Brochure Identification
              </label>
              <input
                type="text"
                required
                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-black uppercase text-xs text-brand-blue tracking-widest outline-none focus:border-brand-blue transition-all"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. MELTON SOUTH GUIDE"
              />
            </div>
            <div>
              <label className="block text-gray-400 font-black uppercase text-[10px] tracking-widest mb-3">
                Primary PDF Document
              </label>
              <div className="relative group/file">
                <input
                  type="file"
                  required
                  accept=".pdf"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleFileChange}
                />
                <div className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl flex items-center justify-between group-hover/file:border-brand-blue transition-all">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic truncate max-w-[150px]">
                    {formData.file ? formData.file.name : "SELECT PDF"}
                  </span>
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-gray-400 font-black uppercase text-[10px] tracking-widest mb-3">
                Thumbnail Cover (Opt)
              </label>
              <div className="relative group/thumb">
                <input
                  type="file"
                  accept=".jpeg,.jpg,.png"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleThumbnailChange}
                />
                <div className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl flex items-center justify-between group-hover/thumb:border-brand-blue transition-all">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic truncate max-w-[150px]">
                    {formData.thumbnail
                      ? formData.thumbnail.name
                      : "SELECT IMAGE"}
                  </span>
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
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-brand-blue text-white py-5 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 transform hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {uploading ? "Transmitting..." : "Upload Collateral"}
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Collateral Title
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Classification
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Publication Date
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-10 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-brand-blue mx-auto"></div>
                  </td>
                </tr>
              ) : brochures.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center space-y-4">
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
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
                      No Brochures Identified
                    </p>
                  </td>
                </tr>
              ) : (
                brochures.map((b) => (
                  <tr
                    key={b.id || b._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-brand-gold/5 flex items-center justify-center text-brand-gold font-black text-lg shadow-sm border border-brand-gold/10 group-hover:scale-110 transition-transform flex-shrink-0">
                          {b.title.charAt(0).toUpperCase()}
                        </div>
                        <p className="text-brand-blue font-black uppercase text-sm tracking-tight leading-none">
                          {b.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center px-3 py-1 bg-gray-50 text-gray-600 text-[10px] font-black uppercase rounded-full border border-gray-100 tracking-widest">
                        {b.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-gray-500 font-medium text-sm italic">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 font-medium text-right">
                      <div className="flex justify-end gap-2">
                        <a
                          href={`${image_url}/${b.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2.5 rounded-xl bg-gray-100 text-gray-400 hover:bg-brand-blue hover:text-white transition-all shadow-sm"
                          title="Review Collateral"
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
                        </a>
                        <button
                          onClick={() => handleDelete(b.id || b._id)}
                          className="p-2.5 rounded-xl bg-red-100 text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          title="Purge Collateral"
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
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
