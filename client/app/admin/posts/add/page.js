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
  const [preview, setPreview] = useState(null);

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
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
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
      console.error(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-brand-blue uppercase tracking-tight">
            Draft <span className="text-brand-gold">Article</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Compose a new insight for the community
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
          Discard Draft
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
      >
        {/* Main Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                  Article Title
                </label>
                <input
                  type="text"
                  name="title"
                  className="w-full px-6 py-4 text-2xl font-black text-brand-blue rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand-gold focus:border-brand-gold outline-none transition-all placeholder:text-gray-200"
                  placeholder="Enter a compelling title..."
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-black text-brand-blue uppercase mb-2 tracking-wider">
                  Content Body
                </label>
                <textarea
                  name="content"
                  className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-brand-gold outline-none transition-all min-h-[500px] text-lg leading-relaxed font-serif text-gray-700 placeholder:text-gray-200"
                  placeholder="Share your insights here... (Markdown supported)"
                  rows="12"
                  value={formData.content}
                  onChange={handleChange}
                  required
                ></textarea>
                <div className="mt-2 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <span>Character Count: {formData.content.length}</span>
                  <span>Rich Text Editor coming soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Metadata & Media */}
        <div className="space-y-6">
          {/* Media Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-6 pb-2 border-b border-gray-50">
              <div className="w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center text-brand-gold">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-brand-blue">Cover Image</h3>
            </div>

            <div className="relative group overflow-hidden rounded-2xl aspect-video bg-gray-50 border-2 border-dashed border-gray-200 transition-all hover:border-brand-gold/30">
              <input
                type="file"
                name="image"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleChange}
                accept=".jpeg,.jpg,.png"
              />

              {preview ? (
                <div className="relative w-full h-full">
                  <img
                    src={preview}
                    alt="Cover Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-xs font-black uppercase py-2 px-4 rounded-full shadow-lg">
                      Change Image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full p-4 pointer-events-none">
                  <svg
                    className="w-8 h-8 text-gray-200 mb-2"
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
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">
                    Click to upload header visual
                  </p>
                </div>
              )}
            </div>
            <p className="mt-4 text-[10px] leading-tight text-gray-400">
              Recommended size: 1200x630px. Only JPG, JPEG and PNG formats are
              accepted for high-quality rendering.
            </p>
          </div>

          {/* Action Card */}
          <div className="bg-brand-blue p-8 rounded-3xl shadow-xl shadow-brand-blue/20 text-white">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4">
              Publish Detail
            </h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-xs py-2 border-b border-white/10">
                <span className="opacity-60 font-medium">Status</span>
                <span className="font-black uppercase tracking-widest text-brand-gold">
                  Draft
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-2 border-b border-white/10">
                <span className="opacity-60 font-medium">Visibility</span>
                <span className="font-black uppercase tracking-widest">
                  Public
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-2">
                <span className="opacity-60 font-medium">Author</span>
                <span className="font-black uppercase tracking-widest">
                  Administrator
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-gold text-brand-blue py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-black/10 hover:shadow-brand-gold/40 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Broadcasting..." : "Publish Insight"}
            </button>
            <p className="text-[9px] text-white/40 text-center mt-4 uppercase font-bold tracking-widest">
              Action will immediately update live feed
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
