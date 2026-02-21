"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  getProjectById,
  updateProject,
} from "../../../../../services/projectService";
import dynamic from "next/dynamic";
const MapPicker = dynamic(() => import("../../../../../components/MapPicker"), {
  ssr: false,
  loading: () => <p>Loading Map...</p>,
});

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
      });
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch project");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare data for submission - handling structured data
      const dataToSubmit = {
        ...formData,
        location: JSON.stringify(formData.location), // Backend expects stringified JSON for location if using FormData usually, but let's check service
        // Service uses multipart/form-data? If so, we need to append everything to FormData
      };

      // Since creating project uses FormData for images, update should probably too if we support image uploads here.
      // For now, let's assume we send JSON if no new images, or FormData if there are.
      // But let's check the service implementation. service uses api.put which sends JSON by default unless we specify headers.
      // Wait, projectService.updateProject sets "Content-Type": "multipart/form-data".
      // So we MUST send FormData.

      // Quick fix: sending regular JSON object if no files?
      // The updateProject service hardcodes multipart/form-data.
      // So we must use FormData.

      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("price", formData.price);
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

      // Images not handled in this basic edit form yet

      await updateProject(id, payload);
      router.push("/admin/projects");
    } catch (error) {
      console.error("Failed to update project", error);
      alert("Failed to update project");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-6">Edit Project</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            >
              <option value="Dual Key">Dual Key</option>
              <option value="Terrace">Terrace</option>
              <option value="Land">Land</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Type</label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Status</label>
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="md:col-span-2 border p-4 rounded bg-gray-50">
            <label className="block text-gray-700 font-bold mb-2">
              Price Range
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  name="priceRange.min"
                  placeholder="Min"
                  value={formData.priceRange.min}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  name="priceRange.max"
                  placeholder="Max"
                  value={formData.priceRange.max}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Currency
                </label>
                <input
                  type="text"
                  name="priceRange.currency"
                  placeholder="Currency"
                  value={formData.priceRange.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Developer
            </label>
            <input
              type="text"
              name="developer"
              value={formData.developer}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Total Units
            </label>
            <input
              type="number"
              name="totalUnits"
              value={formData.totalUnits}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Available Units
            </label>
            <input
              type="number"
              name="availableUnits"
              value={formData.availableUnits}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Completion Date
            </label>
            <input
              type="date"
              name="completionDate"
              value={formData.completionDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Associate Only
            </label>
            <input
              type="checkbox"
              name="associateOnly"
              checked={formData.associateOnly}
              onChange={handleChange}
              className="mr-2 leading-tight"
            />
            <span className="text-sm">Restrict to associates</span>
          </div>
        </div>

        <h2 className="text-xl font-bold mt-6 mb-4">Location</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Address
            </label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">City</label>
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">State</label>
            <input
              type="text"
              name="location.state"
              value={formData.location.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Postcode
            </label>
            <input
              type="text"
              name="location.postcode"
              value={formData.location.postcode}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Country
            </label>
            <input
              type="text"
              name="location.country"
              value={formData.location.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div className="md:col-span-2 mt-4">
          <label className="block text-gray-700 font-bold mb-2">
            Select on Map
          </label>
          <p className="text-sm text-gray-500 mb-2">
            Search for an address or click on the map to automatically set the
            address fields.
          </p>
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

        <div className="mb-4 mt-6">
          <label className="block text-gray-700 font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded h-32"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update Project
          </button>
        </div>
      </form>
    </div>
  );
}
