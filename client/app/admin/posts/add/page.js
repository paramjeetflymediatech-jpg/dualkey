"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPost } from "../../../../services/contentService";

import toast from "react-hot-toast";

export default function AddPost() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
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
    data.append("content", formData.content);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await createPost(data);
      toast.success("Post created successfully!");
      router.push("/admin/posts");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Add New Blog Post</h1>
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
          <label className="block text-gray-700 font-bold mb-2">Content</label>
          <textarea
            name="content"
            className="w-full px-3 py-2 border rounded"
            rows="8"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 font-bold mb-2">
            Cover Image
          </label>
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
          {loading ? "Publishing..." : "Publish Post"}
        </button>
      </form>
    </div>
  );
}
