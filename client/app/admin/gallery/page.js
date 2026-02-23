"use client";

import { useState, useEffect, useRef } from "react";
import {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
  image_url,
} from "../../../services/galleryService";
import Pagination from "../../../components/Pagination";
import toast from "react-hot-toast";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    image: null,
    type: "image",
    caption: "",
    category: "Main Dwelling",
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);

  const categories = [
    "Main Dwelling",
    "Rear Unit",
    "Exterior",
    "Interior",
    "Floor Plans",
  ];

  useEffect(() => {
    fetchGallery(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (selectedImage && selectedImage.type === "360" && viewerRef.current) {
      if (window.pannellum) {
        if (pannellumInstance.current) {
          viewerRef.current.innerHTML = "";
        }

        pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
          type: "equirectangular",
          panorama: `${image_url}${selectedImage.image}`,
          autoLoad: true,
          compass: true,
          hfov: 100,
          haov: 360,
          vaov: 180,
        });
      }
    }
  }, [selectedImage]);

  const fetchGallery = async (page) => {
    try {
      const data = await getGalleryItems(page, 12);
      setItems(data.gallery);
      setTotalPages(data.pages);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      if (file) {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
        if (!allowedTypes.includes(file.type)) {
          toast.error("Only JPEG, JPG, and PNG images are allowed!");
          return;
        }
        setFormData({ ...formData, image: file });
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return toast.error("Please select an image");

    setLoading(true);
    const data = new FormData();
    data.append("image", formData.image);
    data.append("type", formData.type);
    data.append("caption", formData.caption);
    data.append("category", formData.category);

    try {
      await createGalleryItem(data);
      toast.success("Item added successfully");
      setFormData({
        image: null,
        type: "image",
        caption: "",
        category: "Main Dwelling",
      });
      document.getElementById("fileInput").value = "";
      fetchGallery(currentPage);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteGalleryItem(id);
      toast.success("Item purged from gallery");
      fetchGallery(currentPage);
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleView = (item) => {
    setSelectedImage(item);
  };

  const closeViewer = () => {
    setSelectedImage(null);
    pannellumInstance.current = null;
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Card */}
      <div className="flex items-center justify-between mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-brand-blue uppercase tracking-tight">
            Visual <span className="text-brand-gold">Archives</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Curate premium property photography and 360° experiences.
          </p>
        </div>
      </div>

      {/* Add New Item Section */}
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 mb-12">
        <h2 className="text-xl font-black text-brand-blue uppercase tracking-tight mb-8">
          Deploy New Asset
        </h2>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-gray-400 font-black uppercase text-[10px] tracking-widest mb-3">
                Media File (JPG/PNG)
              </label>
              <div className="relative group/file">
                <input
                  id="fileInput"
                  type="file"
                  name="image"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  onChange={handleChange}
                  accept=".jpeg,.jpg,.png"
                  required
                />
                <div className="w-full bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover/file:border-brand-blue transition-all">
                  <svg
                    className="w-8 h-8 text-gray-300 group-hover/file:text-brand-blue transition-colors"
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
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest italic">
                    {formData.image ? formData.image.name : "Select Asset File"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-black uppercase text-[10px] tracking-widest mb-3">
                Asset Classification
              </label>
              <select
                name="type"
                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-black uppercase text-xs text-brand-blue tracking-widest outline-none focus:border-brand-blue transition-all appearance-none"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="image">Standard Still Image</option>
                <option value="360">360° Equirectangular</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 font-black uppercase text-[10px] tracking-widest mb-3">
                Design Category
              </label>
              <select
                name="category"
                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-black uppercase text-xs text-brand-blue tracking-widest outline-none focus:border-brand-blue transition-all appearance-none"
                value={formData.category}
                onChange={handleChange}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-400 font-black uppercase text-[10px] tracking-widest mb-3">
                Asset Descriptor
              </label>
              <input
                type="text"
                name="caption"
                placeholder="E.g. Penthouse Living Area"
                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 rounded-2xl font-black uppercase text-xs text-brand-blue tracking-widest outline-none focus:border-brand-blue transition-all"
                value={formData.caption}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-blue text-white py-5 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 transform hover:-translate-y-1 transition-all disabled:opacity-50"
          >
            {loading ? "Transmitting..." : "Add to Archives"}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-10 border-b border-gray-100">
          <h2 className="text-xl font-black text-brand-blue uppercase tracking-tight">
            Active Archives
          </h2>
        </div>
        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {items.map((item) => (
              <div
                key={item._id}
                className="relative group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1"
              >
                <div className="aspect-w-4 aspect-h-3 bg-gray-100 relative">
                  <img
                    src={`${image_url}${item.image}`}
                    alt={item.caption}
                    className="object-cover w-full h-48"
                  />
                  {item.type === "360" && (
                    <div className="absolute top-4 right-4 bg-brand-gold text-brand-blue text-[10px] font-black px-3 py-1 rounded-full shadow-lg border border-brand-blue/5">
                      360° VIEW
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {item.category || "Uncategorized"}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-xs font-black text-brand-blue uppercase tracking-tight truncate mb-4">
                    {item.caption || "Untitled Asset"}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(item)}
                      className="flex-1 bg-gray-100 text-brand-blue text-[10px] font-black uppercase tracking-widest py-3 rounded-xl hover:bg-brand-blue hover:text-white transition-all shadow-sm"
                    >
                      Inspect
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-3 bg-red-50 text-red-400 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                      title="Purge"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {items.length === 0 && (
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
                No Visual Assets Identified
              </p>
            </div>
          )}

          <div className="mt-12 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* View Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-blue/90 backdrop-blur-xl p-8">
          <div className="relative w-full max-w-6xl h-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-8 flex justify-between items-center bg-white border-b border-gray-100">
              <div>
                <h3 className="text-xl font-black text-brand-blue uppercase tracking-tight">
                  {selectedImage.type === "360"
                    ? "360° Panoptic Preview"
                    : "Static Asset Inspection"}
                </h3>
                {selectedImage.caption && (
                  <p className="text-sm text-gray-400 font-medium italic mt-1">
                    {selectedImage.caption}
                  </p>
                )}
              </div>
              <button
                onClick={closeViewer}
                className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gray-100 text-gray-400 hover:bg-brand-blue hover:text-white transition-all shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex-1 relative bg-gray-50 flex items-center justify-center p-12">
              {selectedImage.type === "360" ? (
                <div
                  ref={viewerRef}
                  className="w-full h-full rounded-2xl shadow-xl overflow-hidden"
                  id="admin-panorama"
                ></div>
              ) : (
                <img
                  src={`${image_url}${selectedImage.image}`}
                  alt={selectedImage.caption}
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-xl"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
