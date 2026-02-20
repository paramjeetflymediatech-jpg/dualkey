"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProject } from "../../../../services/projectService";

import toast from "react-hot-toast";

export default function AddProject() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    category: "Dual Key", // Default
    image: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    if (formData.price) data.append("price", formData.price);
    data.append("location", formData.location);
    data.append("category", formData.category);
    if (formData.image) data.append("image", formData.image);

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
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Project</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
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

        <div>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Price (Optional)
            </label>
            <input
              type="number"
              name="price"
              className="w-full px-3 py-2 border rounded"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              className="w-full px-3 py-2 border rounded"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">Category</label>
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
