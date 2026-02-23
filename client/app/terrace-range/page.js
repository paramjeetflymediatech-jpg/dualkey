"use client";

import { useEffect, useState, useContext } from "react";
import Navbar from "../../components/Navbar";
import { getAllProjects } from "../../services/projectService";
import { image_url } from "../../services/contentService";
import { Footer } from "../../components/Footer";
import Pagination from "../../components/Pagination";
import Link from "next/link";
import { AuthContext } from "../../context/AuthContext";

export default function TerraceRange() {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchTerraceProjects(currentPage);
  }, [currentPage]);

  const fetchTerraceProjects = async (page) => {
    setLoading(true);
    try {
      // Filter by category "Terrace"
      const data = await getAllProjects(page, 9, { category: "Terrace" });
      setProjects(data.projects);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Error fetching terrace projects:", error);
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

      {/* Premium Hero Section */}
      <section className="relative h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000"
            alt="Terrace Range Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/90 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter uppercase">
              The <span className="text-brand-gold">Terrace</span> Range
            </h1>
            <p className="text-xl md:text-2xl font-light text-gray-200 mb-10 leading-relaxed italic border-l-4 border-brand-gold pl-6">
              "Experience the perfect synergy of luxury, privacy, and
              exceptional investment yield in Victoria's most sought-after
              locations."
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-brand-gold text-brand-blue px-10 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition shadow-2xl"
              >
                Enquire Now
              </Link>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-black uppercase tracking-widest hover:bg-white/20 transition">
                View Gallery
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 1 Property 2 Rental Incomes Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 relative">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
                alt="1 Property 2 Rental Incomes"
                className="rounded-3xl shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-brand-gold rounded-full opacity-20 z-0 scale-75"></div>
            </div>
            <div className="order-1 lg:order-2 space-y-8">
              <div className="space-y-4">
                <h2 className="text-sm font-black text-brand-gold uppercase tracking-[0.3em]">
                  Exclusive Opportunity
                </h2>
                <h3 className="text-4xl md:text-5xl font-black text-brand-blue uppercase tracking-tighter leading-none">
                  1 Property <br />
                  <span className="text-brand-gold text-5xl md:text-6xl">
                    2 Rental Incomes
                  </span>
                </h3>
              </div>
              <div className="space-y-6">
                <p className="text-xl text-gray-700 font-bold italic leading-relaxed">
                  Dual Key Victoria have added an additional product to their
                  range. The new Dual Key Terrace has been innovatively designed
                  for the astute investor.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  The Terrace is a never seen before product that provides a
                  dual income stream via the ground floor and first floor, both
                  with private and secure access, including outdoor areas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Independent Living Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-sm font-black text-brand-gold uppercase tracking-[0.3em] mb-4">
            Functional Design
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-brand-blue uppercase tracking-tighter mb-16">
            Private & Secure Living
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="group bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition duration-500 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
                alt="Ground Floor"
                className="w-full h-48 object-cover rounded-2xl mb-8 group-hover:scale-105 transition duration-700"
              />
              <h4 className="text-2xl font-black text-brand-blue uppercase mb-4">
                Independent Living <br />
                <span className="text-brand-gold">Ground Floor</span>
              </h4>
              <p className="text-gray-500 font-light italic">
                Complete privacy with its own secure entry and private outdoor
                sanctuary.
              </p>
            </div>
            <div className="group bg-gray-50 p-10 rounded-[2.5rem] border border-gray-100 hover:shadow-2xl transition duration-500 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200"
                alt="First Floor"
                className="w-full h-48 object-cover rounded-2xl mb-8 group-hover:scale-105 transition duration-700"
              />
              <h4 className="text-2xl font-black text-brand-blue uppercase mb-4">
                Independent Living <br />
                <span className="text-brand-gold">First Floor</span>
              </h4>
              <p className="text-gray-500 font-light italic">
                Eleveated luxury with separate access and dedicated balcony for
                ultimate comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Yield & Gearing Section */}
      <section className="py-24 bg-brand-blue text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold"></div>
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Positively Geared <br />
                <span className="text-brand-gold">From Day 1</span>
              </h3>
              <p className="text-xl text-gray-300 font-light leading-relaxed">
                On average, the Dual Key Terrace outperforms the standard
                residential townhouse by{" "}
                <span className="text-white font-black">$16,000 per annum</span>{" "}
                in rental income.
              </p>
              <p className="text-lg text-brand-gold font-bold italic">
                You won't find a better investment with returns of up to 8% per
                annum!
              </p>
              <div className="pt-6">
                <p className="text-sm text-gray-400 uppercase tracking-widest border-t border-white/10 pt-6">
                  The Hampton inspired Terrace Range is exclusive to selected
                  states.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center">
                <div className="text-5xl font-black text-brand-gold mb-2">
                  8%
                </div>
                <div className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                  Yield
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center">
                <div className="text-5xl font-black text-brand-gold mb-2">
                  $16k
                </div>
                <div className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                  Extra Income
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 text-center col-span-2">
                <div className="text-4xl font-black text-white mb-2 uppercase">
                  Hampton
                </div>
                <div className="text-[10px] uppercase tracking-widest font-black text-brand-gold">
                  Inspired Design
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Terrace Projects */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-sm font-black text-brand-gold uppercase tracking-[0.3em] mb-4">
                Curated Selection
              </h2>
              <h3 className="text-4xl md:text-5xl font-black text-brand-blue tracking-tighter uppercase leading-none">
                Terrace <span className="text-brand-gold">Opportunities</span>
              </h3>
            </div>
            <Link
              href="/gallery"
              className="text-brand-blue font-black underline underline-offset-8 uppercase tracking-widest hover:text-brand-gold transition"
            >
              View All Floorplans
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <h3 className="text-xl text-gray-400 font-bold uppercase tracking-widest">
                No Terrace projects available at the moment.
              </h3>
              <p className="text-gray-400 mt-2">
                Check back soon or contact us for upcoming releases.
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
                    <div className="h-64 relative rounded-[2rem] overflow-hidden mb-8">
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
                      <div className="absolute top-6 left-6 bg-brand-gold text-brand-blue px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                        Terrace Range
                      </div>
                    </div>
                    <div className="px-6 pb-6 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black text-brand-blue tracking-tighter uppercase leading-tight group-hover:text-brand-gold transition">
                          {project.title}
                        </h3>
                      </div>
                      <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 italic">
                        "{project.description}"
                      </p>

                      <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">
                            Starting From
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

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="bg-brand-gold rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-brand-blue uppercase tracking-tighter mb-8 max-w-4xl mx-auto">
                Build Your <span className="underline">Wealth</span> with the
                Terrace Range today.
              </h2>
              <p className="text-xl text-brand-blue/80 font-bold mb-12 max-w-2xl mx-auto italic">
                Join hundreds of successful investors who have chosen Dual Key
                Victoria as their partner in property wealth.
              </p>
              <Link
                href="/contact"
                className="inline-block bg-brand-blue text-white px-12 py-5 rounded-full font-black uppercase tracking-widest hover:scale-110 transition shadow-2xl"
              >
                Request Financial Breakdown
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
