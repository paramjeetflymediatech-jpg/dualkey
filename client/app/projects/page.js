"use client";

import { useEffect, useState, useContext } from "react";
import { getAllProjects } from "../../services/projectService";
import { image_url } from "../../services/contentService";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import Pagination from "../../components/Pagination";
import Link from "next/link";
import { AuthContext } from "../../context/AuthContext";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProjects(currentPage);
  }, [currentPage]);

  const fetchProjects = async (page) => {
    setLoading(true);
    try {
      const data = await getAllProjects(page, 9);
      setProjects(data.projects);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000"
            alt="Projects Portfolio Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/90 via-brand-blue/40 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-3xl">
            <span className="text-brand-gold font-black uppercase tracking-[0.4em] text-xs mb-4 block">
              Investment Portfolio
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter uppercase">
              Premier <span className="text-brand-gold">Assets</span>
            </h1>
            <p className="text-xl font-light text-gray-200 mb-8 leading-relaxed max-w-2xl italic border-l-4 border-brand-gold pl-6">
              Explore our curated selection of high-yield dual-key properties
              and luxury terraces across Australia's most promising growth
              corridors.
            </p>
          </div>
        </div>
      </section>

      {/* The Dual-Key Advantage Section (Fills the "Empty" space) - Only shown to Guests/Admins */}
      {(!user || user.role === "admin") && (
        <section className="py-24 bg-gray-50 border-y border-gray-100">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-sm font-black text-brand-gold uppercase tracking-[0.3em] mb-4">
                What is a DK Home?
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-brand-blue uppercase tracking-tighter mb-8 leading-none">
                The <span className="text-brand-gold">Dual-Key</span> Advantage
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed italic">
                A Dual-Key (DK) property is a smart architectural solution
                designed for maximum investment flexibility. It consists of a
                single title home split into two independent, fully
                self-contained dwellings under one roof.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-black text-brand-blue uppercase mb-4 tracking-tight">
                  Double Income
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Collect two separate rental checks from a single property
                  asset, significantly increasing your cash flow.
                </p>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-blue/10 text-brand-blue rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-black text-brand-blue uppercase mb-4 tracking-tight">
                  Lower Risk
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  If one unit is vacant, the other continues to generate income,
                  providing an essential safety net for your investment.
                </p>
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center mb-6">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h4 className="text-xl font-black text-brand-blue uppercase mb-4 tracking-tight">
                  Smart Design
                </h4>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Innovative floorplans that ensure complete privacy and noise
                  insulation for both sets of occupants.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Asset Grid Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-sm font-black text-brand-gold uppercase tracking-[0.3em] mb-4">
                Available Portfolio
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-brand-blue tracking-tighter uppercase leading-none">
                Exclusive <span className="text-brand-gold">Opportunities</span>
              </h3>
            </div>
            <div className="text-gray-400 text-sm font-bold uppercase tracking-widest">
              Showing {projects.length} Premier Assets
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
              <h3 className="text-xl text-gray-400 font-bold uppercase tracking-widest">
                Portfolio is currently exclusive.
              </h3>
              <p className="text-gray-400 mt-2">
                New assets are being processed. Contact our consultants for
                off-market access.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="group flex flex-col h-full rounded-[2.5rem] border border-gray-100 bg-white p-4 shadow-xl hover:shadow-2xl transition duration-500"
                  >
                    <div className="h-64 relative rounded-[2.2rem] overflow-hidden mb-8">
                      {project.images && project.images.length > 0 ? (
                        <img
                          src={`${image_url}${project.images[0]}`}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 uppercase font-black tracking-widest">
                          No Image
                        </div>
                      )}

                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                        <span className="bg-brand-gold text-brand-blue px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                          {project.category}
                        </span>
                        <span className="bg-white/90 backdrop-blur-md text-brand-blue px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-white/20">
                          {project.status}
                        </span>
                      </div>
                    </div>

                    <div className="px-6 pb-6 flex-grow flex flex-col">
                      <h3 className="text-2xl font-black text-brand-blue tracking-tighter uppercase leading-tight group-hover:text-brand-gold transition mb-4">
                        {project.title}
                      </h3>

                      <div className="flex items-center gap-2 text-gray-400 text-xs font-bold uppercase tracking-widest mb-6">
                        <svg
                          className="w-4 h-4 text-brand-gold"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                        </svg>
                        {project.location?.city}, {project.location?.state}
                      </div>

                      <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 italic">
                        "{project.description}"
                      </p>

                      <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
                            Valuation Approx.
                          </p>
                          <p className="text-xl font-black text-brand-blue">
                            {project.priceRange &&
                            (project.priceRange.min || project.priceRange.max)
                              ? `${project.priceRange.min ? `$${project.priceRange.min.toLocaleString()}` : ""} ${project.priceRange.min && project.priceRange.max ? "-" : ""} ${project.priceRange.max ? `$${project.priceRange.max.toLocaleString()}` : ""}`
                              : project.hasAccess || !project.associateOnly
                                ? "POA"
                                : "RESTRICTED ACCESS"}
                          </p>
                        </div>
                        <Link
                          href={`/projects/${project.slug}`}
                          className="w-12 h-12 bg-brand-blue text-white rounded-2xl flex items-center justify-center group-hover:bg-brand-gold transition shadow-md group-hover:rotate-12"
                        >
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
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-16 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
