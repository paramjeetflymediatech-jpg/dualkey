"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import { getGalleryItems, image_url } from "../../services/galleryService";

import Pagination from "../../components/Pagination";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const viewerRef = useRef(null);
  // Keep track of the viewer instance to destroy it properly
  const pannellumInstance = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // ... (rest of component)
  // ...
  {
    items.length === 0 ? (
      <p className="text-gray-500">No images available yet.</p>
    ) : (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-gray-200 h-64 rounded-lg shadow-md overflow-hidden hover:opacity-90 transition relative group cursor-pointer"
              onClick={() => handleImageClick(item)}
            >
              <img
                src={`${image_url}${item.image}`}
                alt={item.caption || "Gallery Image"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300 flex items-end justify-center pb-4">
                {item.caption && (
                  <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition duration-300 bg-black bg-opacity-50 px-3 py-1 rounded">
                    {item.caption}
                  </span>
                )}
              </div>
              {item.type === "360" && (
                <div className="absolute top-2 right-2 bg-brand-gold text-brand-blue font-bold px-2 py-1 rounded shadow z-10">
                  360° View
                </div>
              )}
              {item.type === "360" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black bg-opacity-50 p-4 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-12 w-12 text-white"
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
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </>
    );
  }

  useEffect(() => {
    if (selectedImage && selectedImage.type === "360" && viewerRef.current) {
      if (window.pannellum) {
        // Destroy previous instance if exists
        if (pannellumInstance.current) {
          // Pannellum doesn't have a clean destroy method on the global object easily accessible
          // without keeping the instance. But viewer() returns the viewer.
          // However, simpler is to clear the container.
          viewerRef.current.innerHTML = "";
        }

        pannellumInstance.current = window.pannellum.viewer(viewerRef.current, {
          type: "equirectangular",
          panorama: `${image_url}${selectedImage.image}`,
          autoLoad: true,
          compass: true,
        });
      }
    }
  }, [selectedImage]);

  const fetchGallery = async (page) => {
    try {
      const data = await getGalleryItems(page, 12);
      setItems(data.items);
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
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-brand-blue tracking-tight">
          Gallery
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          Explore the stunning interiors and modern facades of our completed
          Dual Key homes.
        </p>

        {items.length === 0 ? (
          <p className="text-gray-500">No images available yet.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-200 h-64 rounded-lg shadow-md overflow-hidden hover:opacity-90 transition relative group cursor-pointer"
                  onClick={() => handleImageClick(item)}
                >
                  <img
                    src={`${image_url}${item.image}`}
                    alt={item.caption || "Gallery Image"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300 flex items-end justify-center pb-4">
                    {item.caption && (
                      <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition duration-300 bg-black bg-opacity-50 px-3 py-1 rounded">
                        {item.caption}
                      </span>
                    )}
                  </div>
                  {item.type === "360" && (
                    <div className="absolute top-2 right-2 bg-brand-gold text-brand-blue font-bold px-2 py-1 rounded shadow z-10">
                      360° View
                    </div>
                  )}
                  {item.type === "360" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="bg-black bg-opacity-50 p-4 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-white"
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
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}

        {/* 360 Viewer Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="relative w-full max-w-6xl h-3/4 bg-black rounded-lg overflow-hidden">
              <button
                onClick={closeViewer}
                className="absolute top-4 right-4 text-white z-50 text-2xl font-bold hover:text-gray-300 bg-black bg-opacity-50 px-2 rounded"
              >
                ✕
              </button>
              <div
                ref={viewerRef}
                className="w-full h-full"
                id="panorama"
              ></div>
              <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 px-4 py-2 rounded">
                {selectedImage.caption}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
