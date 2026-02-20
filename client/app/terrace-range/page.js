"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAllProjects } from "../../services/projectService";
import { image_url } from "../../services/contentService";

import Link from "next/link";
import Pagination from "../../components/Pagination";

export default function TerraceRange() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerraceProjects(currentPage);
  }, [currentPage]);

  const fetchTerraceProjects = async (page) => {
    setLoading(true);
    try {
      const data = await getAllProjects();
      console.log(data);
      setProjects(data.projects);
      setTotalPages(data.pages);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch projects", error);
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-brand-blue tracking-tight">
          Terrace Range
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          Stylish and compact living solutions. Our Terrace Range offers modern
          design with efficient space utilization.
        </p>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue mx-auto"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl text-gray-400">
              No Terrace projects currently available.
            </h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div
                  key={project._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      {project.images && project.images.length > 0 ? (
                        <img
                          src={`${image_url}${project.images[0]}`}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 text-brand-blue">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <p className="font-bold text-brand-gold">
                      {project.price
                        ? `$${project.price.toLocaleString()}`
                        : "POA"}
                    </p>
                  </div>
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
      </div>
    </div>
  );
}
