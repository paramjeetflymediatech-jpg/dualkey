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
    image: null,
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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
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
    if (formData.image) data.append("image", formData.image);

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
      console.error(error);
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">Title</label>
            <input
              type="text"
              name="title"
              className="w-full px-3 py-2 border rounded"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 font-bold mb-2">
              Description
            </label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border rounded"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Developer
            </label>
            <input
              type="text"
              name="developer"
              className="w-full px-3 py-2 border rounded"
              value={formData.developer}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Type</label>
            <input
              type="text"
              name="type"
              placeholder="e.g. Apartment, Villa"
              className="w-full px-3 py-2 border rounded"
              value={formData.type}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">Status</label>
            <select
              name="status"
              className="w-full px-3 py-2 border rounded"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Under Construction">Under Construction</option>
              <option value="Completed">Completed</option>
              <option value="Planning">Planning</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Category (Legacy)
            </label>
            <select
              name="category"
              className="w-full px-3 py-2 border rounded"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="Dual Key">Dual Key</option>
              <option value="Terrace">Terrace</option>
              <option value="Land">Land</option>
            </select>
          </div>
        </div>

        {/* Units & Completion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Total Units
            </label>
            <input
              type="number"
              name="totalUnits"
              className="w-full px-3 py-2 border rounded"
              value={formData.totalUnits}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Available Units
            </label>
            <input
              type="number"
              name="availableUnits"
              className="w-full px-3 py-2 border rounded"
              value={formData.availableUnits}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Completion Date
            </label>
            <input
              type="date"
              name="completionDate"
              className="w-full px-3 py-2 border rounded"
              value={formData.completionDate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Price Range */}
        <div className="border p-4 rounded bg-gray-50">
          <label className="block text-gray-700 font-bold mb-2">
            Price Range
          </label>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              name="priceRange.min"
              placeholder="Min Price"
              className="w-full px-3 py-2 border rounded"
              value={formData.priceRange.min}
              onChange={handleChange}
            />
            <input
              type="number"
              name="priceRange.max"
              placeholder="Max Price"
              className="w-full px-3 py-2 border rounded"
              value={formData.priceRange.max}
              onChange={handleChange}
            />
            <input
              type="text"
              name="priceRange.currency"
              placeholder="Currency"
              className="w-full px-3 py-2 border rounded"
              value={formData.priceRange.currency}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Location */}
        <div className="border p-4 rounded bg-gray-50">
          <label className="block text-gray-700 font-bold mb-2">Location</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Address"
                className="w-full px-3 py-2 border rounded"
                value={formData.location.address}
                onChange={(e) =>
                  handleLocationChange("address", e.target.value)
                }
              />
            </div>
            <input
              type="text"
              placeholder="City"
              className="w-full px-3 py-2 border rounded"
              value={formData.location.city}
              onChange={(e) => handleLocationChange("city", e.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              className="w-full px-3 py-2 border rounded"
              value={formData.location.state}
              onChange={(e) => handleLocationChange("state", e.target.value)}
            />
            <input
              type="text"
              placeholder="Country"
              className="w-full px-3 py-2 border rounded"
              value={formData.location.country}
              onChange={(e) => handleLocationChange("country", e.target.value)}
            />
            <input
              type="text"
              placeholder="Postcode"
              className="w-full px-3 py-2 border rounded"
              value={formData.location.postcode}
              onChange={(e) => handleLocationChange("postcode", e.target.value)}
            />
            <input
              type="number"
              placeholder="Latitude"
              className="w-full px-3 py-2 border rounded"
              value={formData.location.coordinates.lat || ""}
              onChange={(e) => handleCoordinatesChange("lat", e.target.value)}
            />
            <input
              type="number"
              placeholder="Longitude"
              className="w-full px-3 py-2 border rounded"
              value={formData.location.coordinates.lng || ""}
              onChange={(e) => handleCoordinatesChange("lng", e.target.value)}
            />
            <div className="col-span-2 mt-4 space-y-2">
              <label className="block text-gray-700 font-bold">
                Select on Map
              </label>
              <p className="text-sm text-gray-500 mb-2">
                Search for an address or click on the map to automatically set
                the coordinates above.
              </p>
              <MapPicker
                initialLat={formData.location.coordinates.lat}
                initialLng={formData.location.coordinates.lng}
                onLocationSelect={(lat, lng) => {
                  setFormData((prev) => ({
                    ...prev,
                    location: {
                      ...prev.location,
                      coordinates: {
                        lat: lat,
                        lng: lng,
                      },
                    },
                  }));
                }}
              />
            </div>
          </div>
        </div>

        {/* Features & Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Features (comma separated)
            </label>
            <textarea
              name="features"
              className="w-full px-3 py-2 border rounded"
              rows="3"
              placeholder="Swimming Pool, Gym, etc."
              value={formData.features}
              onChange={handleChange}
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Amenities Nearby (comma separated)
            </label>
            <textarea
              name="amenitiesNearby"
              className="w-full px-3 py-2 border rounded"
              rows="3"
              placeholder="School, Hospital, etc."
              value={formData.amenitiesNearby}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>

        {/* Settings */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="associateOnly"
            id="associateOnly"
            checked={formData.associateOnly}
            onChange={handleChange}
            className="w-5 h-5 text-brand-blue"
          />
          <label htmlFor="associateOnly" className="text-gray-700 font-bold">
            Associate Only Project
          </label>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Image</label>
          <input
            type="file"
            name="image"
            className="w-full"
            onChange={handleChange}
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-blue text-white py-3 rounded font-bold hover:bg-opacity-90 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </div>
  );
}
