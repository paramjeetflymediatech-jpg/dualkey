"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../../../../services/projectService";

import toast from "react-hot-toast";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("../../../../components/MapPicker"), {
  ssr: false,
  loading: () => <p>Loading Map...</p>,
});

export default function AddProject() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    // price: "", // Replaced by priceRange
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      postcode: "",
      coordinates: { lat: null, lng: null },
    },
    category: "Dual Key", // Keeping for backward compat logic if needed
    images: [], // Changed from image: null to images: []
    // New Fields
    developer: "",
    type: "",
    status: "Under Construction",
    totalUnits: "",
    availableUnits: "",
    priceRange: {
      min: "",
      max: "",
      currency: "AUD",
    },
    features: "", // Comma separated string for input
    amenitiesNearby: "", // Comma separated string for input
    completionDate: "",
    associateOnly: false,
  });
  const [previews, setPreviews] = useState([]); // State for image previews
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "images") {
      const files = Array.from(e.target.files);
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

      const invalidFiles = files.filter(
        (file) => !allowedTypes.includes(file.type),
      );
      if (invalidFiles.length > 0) {
        toast.error("Only JPEG, JPG, and PNG images are allowed!");
        return;
      }

      if (formData.images.length + files.length > 5) {
        toast.error("You can only upload up to 5 images");
        return;
      }

      setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (name.startsWith("priceRange.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        priceRange: { ...formData.priceRange, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...previews];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(previews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setFormData({ ...formData, images: newImages });
    setPreviews(newPreviews);
  };

  const handleLocationChange = (field, value) => {
    setFormData({
      ...formData,
      location: { ...formData.location, [field]: value },
    });
  };

  const handleCoordinatesChange = (field, value) => {
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        coordinates: { ...formData.location.coordinates, [field]: value },
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    // data.append("price", formData.price); // Deprecated or mapped? keeping priceRange

    data.append("location", JSON.stringify(formData.location));
    data.append("category", formData.category);

    // Append each image to the 'image' field (which backend expects as array)
    formData.images.forEach((image) => {
      data.append("image", image);
    });

    // New Fields
    data.append("developer", formData.developer);
    data.append("type", formData.type);
    data.append("status", formData.status);
    data.append("totalUnits", formData.totalUnits);
    data.append("availableUnits", formData.availableUnits);
    data.append("priceRange", JSON.stringify(formData.priceRange));

    // Process comma separated strings into arrays
    const featuresArray = formData.features
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    data.append("features", JSON.stringify(featuresArray));

    const amenitiesArray = formData.amenitiesNearby
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    data.append("amenitiesNearby", JSON.stringify(amenitiesArray));

    data.append("completionDate", formData.completionDate);
    data.append("associateOnly", formData.associateOnly);

    try {
      await createProject(data);
      toast.success("Project created successfully!");
      router.push("/admin/projects");
    } catch (error) {
      console.error(error.response?.data?.message || "Something went wrong");
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-brand-blue uppercase tracking-tight">
            Add <span className="text-brand-gold">Project</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create a new premium property listing
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
          Back to List
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 12 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand-blue">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
                placeholder="Enter project name..."
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Project Description
              </label>
              <textarea
                name="description"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all bg-gray-50/30 font-medium min-h-[150px]"
                placeholder="Detail what makes this project unique..."
                rows="4"
                value={formData.description}
                onChange={handleChange}
                required
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
                  placeholder="Company name"
                  value={formData.developer}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                  Property Type
                </label>
                <input
                  type="text"
                  name="type"
                  placeholder="e.g. Dual Occupancy, Townhouse"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
                  value={formData.type}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                  Construction Status
                </label>
                <select
                  name="status"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all bg-gray-50/30 font-medium appearance-none"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Under Construction">Under Construction</option>
                  <option value="Completed">Completed</option>
                  <option value="Planning">Planning</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                  Category (Filtering)
                </label>
                <select
                  name="category"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all bg-gray-50/30 font-medium appearance-none"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Dual Key">Dual Key</option>
                  <option value="Terrace">Terrace</option>
                  <option value="Land">Land</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Logistics & Revenue */}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 4v4m0 8v4M4 12h4m8 0h4"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
                value={formData.totalUnits}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Available Units
              </label>
              <input
                type="number"
                name="availableUnits"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
                value={formData.availableUnits}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Completion
              </label>
              <input
                type="date"
                name="completionDate"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-gold outline-none transition-all bg-gray-50/30 font-medium"
                value={formData.completionDate}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="md:col-span-3 pb-2 border-b border-gray-50">
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                  Price Range Settings
                </span>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Min AUD
                </label>
                <input
                  type="number"
                  name="priceRange.min"
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-gold bg-gray-50/10 font-black text-brand-blue"
                  value={formData.priceRange.min}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Max AUD
                </label>
                <input
                  type="number"
                  name="priceRange.max"
                  placeholder="0.00"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-gold bg-gray-50/10 font-black text-brand-blue"
                  value={formData.priceRange.max}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Currency
                </label>
                <input
                  type="text"
                  name="priceRange.currency"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none bg-gray-100 font-bold text-gray-500"
                  value={formData.priceRange.currency}
                  readOnly
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Location Details */}
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
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
                Full Address
              </label>
              <input
                type="text"
                placeholder="Street address..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-gold transition-all"
                value={formData.location.address}
                onChange={(e) =>
                  handleLocationChange("address", e.target.value)
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <div>
                <label className="block text-sm font-black text-brand-blue uppercase mb-1 tracking-wider text-[10px]">
                  City
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none"
                  value={formData.location.city}
                  onChange={(e) => handleLocationChange("city", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-black text-brand-blue uppercase mb-1 tracking-wider text-[10px]">
                  State/Region
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none"
                  value={formData.location.state}
                  onChange={(e) =>
                    handleLocationChange("state", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-black text-brand-blue uppercase mb-1 tracking-wider text-[10px]">
                  Postcode
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none"
                  value={formData.location.postcode}
                  onChange={(e) =>
                    handleLocationChange("postcode", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-black text-brand-blue uppercase mb-1 tracking-wider text-[10px]">
                  Country
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none"
                  value={formData.location.country}
                  onChange={(e) =>
                    handleLocationChange("country", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="md:col-span-2 pt-6">
              <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 mb-6">
                <div className="flex justify-between items-end mb-4">
                  <div>
                    <h4 className="font-bold text-brand-blue">
                      Map Geolocation
                    </h4>
                    <p className="text-xs text-gray-500">
                      Search address or drop pin manually
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <div className="text-[10px] bg-white px-2 py-1 rounded border border-gray-200">
                      <span className="font-bold text-gray-400">LAT:</span>{" "}
                      {formData.location.coordinates.lat || "--"}
                    </div>
                    <div className="text-[10px] bg-white px-2 py-1 rounded border border-gray-200">
                      <span className="font-bold text-gray-400">LNG:</span>{" "}
                      {formData.location.coordinates.lng || "--"}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden shadow-inner border border-gray-100">
                  <MapPicker
                    initialLat={formData.location.coordinates.lat}
                    initialLng={formData.location.coordinates.lng}
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

        {/* Section 4: Features & Lifestyle */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-50">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
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
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-brand-blue">
              Features & Amenities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Property Features
              </label>
              <textarea
                name="features"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-gold bg-gray-50/20 font-medium"
                rows="4"
                placeholder="e.g. 24/7 Security, High Ceilings, Smart Home (separate by commas)"
                value={formData.features}
                onChange={handleChange}
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                Nearby Amenities
              </label>
              <textarea
                name="amenitiesNearby"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-brand-gold bg-gray-50/20 font-medium"
                rows="4"
                placeholder="e.g. Westfield Shopping, Hospital, Station (separate by commas)"
                value={formData.amenitiesNearby}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex items-center p-4 bg-brand-blue/5 rounded-2xl border border-brand-blue/10">
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
                Associate Only Project
              </label>
              <p className="text-xs text-brand-blue/60">
                Restricts visibility to registered business associates only.
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: Gallery Management */}
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
            <span className="ml-auto text-xs font-bold text-gray-400">
              MAX 5 PHOTOS
            </span>
          </div>

          <div className="relative group cursor-pointer">
            <input
              type="file"
              name="images"
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              onChange={handleChange}
              accept=".jpeg,.jpg,.png"
              multiple
            />
            <div className="border-4 border-dashed border-gray-100 group-hover:border-brand-gold/30 p-12 rounded-3xl text-center transition-all bg-gray-50 group-hover:bg-white">
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-brand-gold transition-transform group-hover:scale-110">
                <svg
                  className="w-8 h-8"
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
              </div>
              <p className="text-brand-blue font-bold tracking-tight">
                Click to browse or drag & drop
              </p>
              <p className="text-xs text-gray-400 mt-1 uppercase font-black">
                JPEG, JPG, PNG ONLY
              </p>
            </div>
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-10">
              {previews.map((preview, index) => (
                <div key={index} className="relative group aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover rounded-2xl shadow-md border-2 border-white"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center backdrop-blur-[2px]">
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 transition-transform hover:scale-125"
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
            </div>
          )}
        </div>

        {/* Sticky Submit Bar */}
        <div className="sticky bottom-8 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-white shadow-2xl flex items-center justify-between gap-4 z-50">
          <p className="text-xs text-gray-500 ml-4 font-medium hidden md:block">
            Ensure all mandatory fields are completed before publication.
          </p>
          <div className="flex gap-3 w-full md:w-auto">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 md:flex-none px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none bg-brand-blue text-white px-12 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50"
            >
              {loading ? "Allocating Resources..." : "Publish Project"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
