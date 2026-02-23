"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  getProjectById,
  updateProject,
} from "../../../../../services/projectService";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
const MapPicker = dynamic(() => import("../../../../../components/MapPicker"), {
  ssr: false,
  loading: () => <p>Loading Map...</p>,
});
import { image_url } from "../../../../../services/contentService";

export default function EditProject({ params }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priceRange: {
      min: "",
      max: "",
      currency: "AUD",
    },
    category: "Dual Key",
    location: {
      address: "",
      city: "",
      state: "",
      postcode: "",
      country: "",
      coordinates: { lat: null, lng: null },
    },
    developer: "",
    type: "",
    status: "",
    totalUnits: "",
    availableUnits: "",
    completionDate: "",
    associateOnly: false,
    images: [],
    price: "", // Keeping for backward compatibility if needed in UI fallback
  });
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (projectId) => {
    try {
      const data = await getProjectById(projectId);
      // Ensure nested objects are handled correctly
      const location =
        typeof data.location === "string"
          ? JSON.parse(data.location)
          : data.location || {};

      const priceRange =
        typeof data.priceRange === "string"
          ? JSON.parse(data.priceRange)
          : data.priceRange || { min: "", max: "", currency: "AUD" };

      setFormData({
        ...data,
        location: {
          address: location.address || "",
          city: location.city || "",
          state: location.state || "",
          postcode: location.postcode || "",
          country: location.country || "",
          coordinates: location.coordinates || { lat: null, lng: null },
        },
        priceRange: {
          min: priceRange.min || "",
          max: priceRange.max || "",
          currency: priceRange.currency || "AUD",
        },
        images: data.images || [],
      });
      setLoading(false);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else if (name.includes("priceRange.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        priceRange: {
          ...prev.priceRange,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    const invalidFiles = files.filter(
      (file) => !allowedTypes.includes(file.type),
    );
    if (invalidFiles.length > 0) {
      toast.error("Only JPEG, JPG, and PNG images are allowed!");
      return;
    }

    if (formData.images.length + newImages.length + files.length > 5) {
      toast.error("Total images cannot exceed 5");
      return;
    }
    setNewImages([...newImages, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewPreviews([...newPreviews, ...previews]);
  };

  const removeExistingImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, images: updatedImages });
  };

  const removeNewImage = (index) => {
    const updatedImages = [...newImages];
    const updatedPreviews = [...newPreviews];
    URL.revokeObjectURL(updatedPreviews[index]);
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setNewImages(updatedImages);
    setNewPreviews(updatedPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("category", formData.category);
      payload.append("location", JSON.stringify(formData.location));
      payload.append("developer", formData.developer);
      payload.append("type", formData.type);
      payload.append("status", formData.status);
      payload.append("totalUnits", formData.totalUnits);
      payload.append("availableUnits", formData.availableUnits);
      payload.append("completionDate", formData.completionDate);
      payload.append("associateOnly", formData.associateOnly);
      payload.append("priceRange", JSON.stringify(formData.priceRange));

      // Pass existing images to keep
      payload.append("images", JSON.stringify(formData.images));

      // Append new files
      newImages.forEach((file) => {
        payload.append("image", file);
      });

      await updateProject(id, payload);
      router.push("/admin/projects");
    } catch (error) {
      console.error(error.response.data.message || "Failed to update project");
      toast.error(error.response.data.message || "Failed to update project");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-brand-blue uppercase tracking-tight">
            Edit <span className="text-brand-gold">Project</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Updating: {formData.title}
          </p>
        </div>
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-brand-blue transition-colors font-medium flex items-center gap-2"
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
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Information */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
            <div className="w-10 h-10 bg-brand-blue/5 rounded-xl flex items-center justify-center text-brand-blue">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand-blue">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-1">
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
                required
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all bg-gray-50/30 font-medium appearance-none"
              >
                <option value="Dual Key">Dual Key</option>
                <option value="Terrace">Terrace</option>
                <option value="Land">Land</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all bg-gray-50/30 font-medium min-h-[120px]"
                rows="4"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2">
              <div>
                <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                  Developer
                </label>
                <input
                  type="text"
                  name="developer"
                  value={formData.developer}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                  Type
                </label>
                <input
                  type="text"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                  Status
                </label>
                <input
                  type="text"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
                />
              </div>
              <div className="flex items-center p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
                <input
                  type="checkbox"
                  name="associateOnly"
                  id="associateOnly"
                  checked={formData.associateOnly}
                  onChange={handleChange}
                  className="w-6 h-6 rounded border-brand-blue text-brand-blue focus:ring-brand-blue cursor-pointer"
                />
                <div className="ml-4">
                  <label
                    htmlFor="associateOnly"
                    className="text-brand-blue font-black uppercase text-sm tracking-wider cursor-pointer"
                  >
                    Associate Only
                  </label>
                  <p className="text-[10px] text-brand-blue/60 leading-tight">
                    Restrict to registered associates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Inventory & Pricing */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
            <div className="w-10 h-10 bg-brand-gold/10 rounded-xl flex items-center justify-center text-brand-gold">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand-blue">
              Inventory & Pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Total Units
              </label>
              <input
                type="number"
                name="totalUnits"
                value={formData.totalUnits}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Available Units
              </label>
              <input
                type="number"
                name="availableUnits"
                value={formData.availableUnits}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
              />
            </div>
            <div>
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Completion
              </label>
              <input
                type="date"
                name="completionDate"
                value={formData.completionDate}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
              />
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="md:col-span-3 pb-2 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Pricing Structure
                </span>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Min AUD
                </label>
                <input
                  type="number"
                  name="priceRange.min"
                  placeholder="Min"
                  value={formData.priceRange.min}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none bg-gray-50/10 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Max AUD
                </label>
                <input
                  type="number"
                  name="priceRange.max"
                  placeholder="Max"
                  value={formData.priceRange.max}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none bg-gray-50/10 font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Currency
                </label>
                <input
                  type="text"
                  name="priceRange.currency"
                  placeholder="Currency"
                  value={formData.priceRange.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-gray-100 font-bold text-gray-400"
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Location Detail */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand-blue">
              Project Location
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Address
              </label>
              <input
                type="text"
                name="location.address"
                value={formData.location.address}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-gold transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  State
                </label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Postcode
                </label>
                <input
                  type="text"
                  name="location.postcode"
                  value={formData.location.postcode}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-200"
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-brand-blue">Map Geolocation</h4>
                  <div className="text-[10px] bg-white px-2 py-1 rounded border border-gray-100 font-mono">
                    {formData.location.coordinates?.lat?.toFixed(4)},{" "}
                    {formData.location.coordinates?.lng?.toFixed(4)}
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden shadow-inner border border-gray-100">
                  <MapPicker
                    initialLat={formData.location.coordinates?.lat}
                    initialLng={formData.location.coordinates?.lng}
                    onLocationSelect={(
                      lat,
                      lng,
                      address,
                      city,
                      state,
                      country,
                      postcode,
                    ) => {
                      setFormData((prev) => ({
                        ...prev,
                        location: {
                          ...prev.location,
                          address: address || prev.location.address,
                          city: city || prev.location.city,
                          state: state || prev.location.state,
                          country: country || prev.location.country,
                          postcode: postcode || prev.location.postcode,
                          coordinates: { lat, lng },
                        },
                      }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Gallery Management */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
            <div className="w-10 h-10 bg-brand-gold/20 rounded-xl flex items-center justify-center text-brand-gold">
              <svg
                className="w-6 h-6"
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
            <h2 className="text-xl font-bold text-brand-blue">
              Project Gallery
            </h2>
            <span className="ml-auto text-[10px] font-black text-gray-300">
              MAX 5 TOTAL
            </span>
          </div>

          <div className="space-y-10">
            {/* Current Images */}
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                Live Assets
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {formData.images.map((img, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={`${image_url}${img}`}
                      alt="Project"
                      className="w-full h-full object-cover rounded-2xl shadow-sm border border-gray-100"
                    />
                    <div className="absolute inset-0 bg-red-600/40 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="bg-white text-red-600 p-2 rounded-full shadow-xl hover:scale-125 transition-transform"
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
                  </div>
                ))}
                {formData.images.length === 0 && (
                  <div className="md:col-span-5 h-20 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl text-gray-300 text-xs font-bold uppercase tracking-widest">
                    No Live Assets
                  </div>
                )}
              </div>
            </div>

            {/* Upload New */}
            <div>
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
                Pending Uploads
              </h3>
              <div className="relative group mb-6">
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpeg,.jpg,.png"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                <div className="border-4 border-dashed border-gray-50 bg-gray-50/50 p-8 rounded-3xl text-center group-hover:bg-white group-hover:border-brand-gold/20 transition-all">
                  <p className="text-brand-blue font-bold text-sm">
                    Add more high-resolution images
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase font-black">
                    JPEG, PNG only
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {newPreviews.map((preview, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={preview}
                      alt="New Preview"
                      className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-brand-gold/30"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="bg-white text-gray-800 p-2 rounded-full shadow-xl hover:scale-125 transition-transform"
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Action Bar */}
        <div className="sticky bottom-8 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-2xl flex items-center justify-between gap-4 z-50">
          <p className="text-xs text-brand-blue ml-4 font-bold uppercase tracking-tighter opacity-40 hidden md:block">
            Project Revision Mode
          </p>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 md:flex-none px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-500 bg-gray-100 hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 md:flex-none bg-brand-blue text-white px-16 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 hover:-translate-y-1 transition-all active:scale-95"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
