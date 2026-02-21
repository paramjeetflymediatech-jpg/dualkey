"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { getGalleryItems, image_url } from "../../services/galleryService";
import Pagination from "../../components/Pagination";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const viewerRef = useRef(null);
  const pannellumInstance = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
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
    if (activeCategory === "All") {
      setFilteredItems(items);
    } else {
      setFilteredItems(
        items.filter((item) => item.category === activeCategory),
      );
    }
  }, [items, activeCategory]);

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
    setLoading(true);
    try {
      const data = await getGalleryItems(page, 20); // Fetch more items for better client-side filtering experience initially
      setItems(data.gallery);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Failed to fetch gallery");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleImageClick = (item) => {
    if (item.type === "360") {
      setSelectedImage(item);
    }
  };

  const closeViewer = () => {
    setSelectedImage(null);
    pannellumInstance.current = null;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />
      <div className="container mx-auto px-6 py-12 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-brand-blue tracking-tight">
            Our Gallery
          </h1>
          <div className="w-24 h-1 bg-brand-gold mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore the stunning interiors and modern facades of our completed
            Dual Key homes. Discover how we maximize space and potential.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
                activeCategory === category
                  ? "bg-brand-blue text-white shadow-md transform scale-105"
                  : "bg-white text-gray-600 hover:bg-gray-100 hover:text-brand-blue border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
            <p className="text-xl text-gray-400">
              No images found in this category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 relative group cursor-pointer border border-gray-100"
                  onClick={() => handleImageClick(item)}
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={`${image_url}${item.image}`}
                      alt={item.caption || "Gallery Image"}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 -z-10 transition-all duration-300 flex items-center justify-center">
                      {item.type === "360" ? (
                        <div className="bg-white bg-opacity-90 p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300 shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-8 w-8 text-brand-blue"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="opacity-0  group-hover:opacity-100 transition-opacity duration-300">
                          {/* Optional: Icon for regular images */}
                        </div>
                      )}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                      {item.type === "360" && (
                        <span className="bg-brand-gold text-brand-blue text-xs font-bold px-2 py-1 rounded shadow-md z-10">
                          360° View
                        </span>
                      )}
                      {item.category && item.category !== "All" && (
                        <span className="bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded shadow-md backdrop-blur-sm">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Caption */}
                  {item.caption && (
                    <div className="p-4 border-t border-gray-100">
                      <p className="text-gray-700 font-medium text-sm truncate">
                        {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination is tricky with client-side filtering if we paginate on server. 
                For now, we fetch a batch and filter client-side. 
                If pagination is strictly server-side, we would need to pass category to API. 
            */}
            {items.length > 0 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}

        {/* 360 Viewer Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-6xl h-3/4 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
              <button
                onClick={closeViewer}
                className="absolute top-4 right-4 text-white z-50 hover:text-brand-gold transition-colors bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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
              <div
                ref={viewerRef}
                className="w-full h-full"
                id="panorama"
              ></div>
              {selectedImage.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 pointer-events-none">
                  <p className="text-white text-lg font-medium">
                    {selectedImage.caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
