"use client";

import { useState, useEffect } from "react";
import {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
  image_url,
} from "../../../services/galleryService";
import Pagination from "../../../components/Pagination";

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    image: null,
    type: "image",
    caption: "",
    category: "Main Dwelling", // Default category
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  const fetchGallery = async (page) => {
    try {
      const data = await getGalleryItems(page, 12);
      setItems(data.gallery);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Failed to fetch gallery");
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image) return alert("Please select an image");

    setLoading(true);
    const data = new FormData();
    data.append("image", formData.image);
    data.append("type", formData.type);
    data.append("caption", formData.caption);
    data.append("category", formData.category);

    try {
      await createGalleryItem(data);
      alert("Item added successfully");
      setFormData({
        image: null,
        type: "image",
        caption: "",
        category: "Main Dwelling",
      });
      // Reset file input manually if needed
      document.getElementById("fileInput").value = "";
      fetchGallery(currentPage);
    } catch (error) {
      console.error(error);
      alert("Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteGalleryItem(id);
      fetchGallery(currentPage);
    } catch (error) {
      console.error("Failed to delete item");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Gallery Management</h1>

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Image Input */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Image / 360 File
              </label>
              <input
                id="fileInput"
                type="file"
                name="image"
                className="w-full"
                onChange={handleChange}
                accept="image/*"
                required
              />
            </div>

            {/* Type Selection */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">Type</label>
              <select
                name="type"
                className="w-full px-3 py-2 border rounded"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="image">Standard Image</option>
                <option value="360">360 Degree View</option>
              </select>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Category
              </label>
              <select
                name="category"
                className="w-full px-3 py-2 border rounded"
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

            {/* Caption Input */}
            <div>
              <label className="block text-gray-700 font-bold mb-2">
                Caption (Optional)
              </label>
              <input
                type="text"
                name="caption"
                className="w-full px-3 py-2 border rounded"
                value={formData.caption}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-brand-blue text-white py-2 px-6 rounded font-bold hover:bg-opacity-90 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Add to Gallery"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Current Gallery Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item._id} className="relative group border rounded p-2">
              <div className="aspect-w-16 aspect-h-9 bg-gray-200 overflow-hidden mb-2 relative">
                <img
                  src={`${image_url}${item.image}`}
                  alt={item.caption}
                  className="object-cover w-full h-40"
                />
                {item.type === "360" && (
                  <div className="absolute top-2 right-2 bg-brand-gold text-brand-blue text-xs font-bold px-2 py-1 rounded">
                    360°
                  </div>
                )}
                {/* Category Badge */}
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                  {item.category || "Uncategorized"}
                </div>
              </div>
              <p className="text-sm text-gray-600 truncate mb-2 font-medium">
                {item.caption || "No Caption"}
              </p>
              <button
                onClick={() => handleDelete(item._id)}
                className="w-full bg-red-500 text-white text-sm py-1 rounded hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        {items.length === 0 && (
          <p className="text-gray-500">No gallery items found.</p>
        )}
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
