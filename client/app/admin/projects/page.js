"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getAllProjects,
  deleteProject,
} from "../../../services/projectService";
import { image_url } from "../../../services/contentService";

import Pagination from "../../../components/Pagination";

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  const fetchProjects = async (page) => {
    try {
      const data = await getAllProjects(page, 10);
      setProjects(data.projects);
      setTotalPages(data.pages);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        fetchProjects(currentPage);
      } catch (error) {
        console.error(error.response.data.message);
        alert(error.response.data.message);
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Card */}
      <div className="flex items-center justify-between mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-black text-brand-blue uppercase tracking-tight">
            Asset <span className="text-brand-gold">Portfolio</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your premium dual-key and terrace range properties
          </p>
        </div>
        <Link
          href="/admin/projects/add"
          className="bg-brand-blue text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 transform hover:-translate-y-1 transition-all flex items-center gap-3"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Asset
        </Link>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Property Asset
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Geographic Location
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Category
                </th>
                <th className="px-8 py-6 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Valuation
                </th>
                <th className="px-8 py-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-100">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {projects.map((project) => (
                <tr
                  key={project._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border-2 border-white flex-shrink-0 group-hover:scale-110 transition-transform">
                        {project.images && project.images.length > 0 ? (
                          <img
                            className="w-full h-full object-cover"
                            src={`${image_url}${project.images[0]}`}
                            alt={project.title}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300">
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
                        )}
                      </div>
                      <div>
                        <p className="text-brand-blue font-black uppercase text-sm tracking-tight leading-none mb-1">
                          {project.title}
                        </p>
                         
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-gray-600 font-medium text-sm italic">
                      {project.location && typeof project.location === "object"
                        ? `${project.location.city}, ${project.location.state}`
                        : project.location}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-3 py-1 bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase rounded-full border border-brand-gold/20 tracking-widest">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-black text-brand-blue text-sm">
                    {project.priceRange &&
                    (project.priceRange.min || project.priceRange.max)
                      ? `${project.priceRange.min ? `$${project.priceRange.min.toLocaleString()}` : ""} ${project.priceRange.min && project.priceRange.max ? "-" : ""} ${project.priceRange.max ? `$${project.priceRange.max.toLocaleString()}` : ""}`
                      : "POA"}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end gap-2  transition-opacity">
                      <Link
                        href={`/admin/projects/${project._id || project.id}`}
                        className="p-2.5 rounded-xl bg-green-100 text-gray-400 hover:bg-green-400 hover:text-white transition-all shadow-sm"
                        title="View Asset"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </Link>
                      <Link
                        href={`/admin/projects/edit/${project._id || project.id}`}
                        className="p-2.5 rounded-xl bg-blue-100 text-blue-400 hover:bg-blue-400 hover:text-white transition-all shadow-sm"
                        title="Modify Asset"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(project._id || project.id)}
                        className="p-2.5 rounded-xl bg-red-100 text-red-400 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                        title="Purge Asset"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {projects.length > 0 && (
          <div className="px-8 py-6 bg-gray-50/50 border-t border-gray-100 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
        {projects.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto text-gray-300">
              <svg
                className="w-10 h-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-400 font-black uppercase text-xs tracking-widest">
              No Property Assets Identified
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
