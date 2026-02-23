"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { getAllProjects } from "../../services/projectService";
import { image_url } from "../../services/contentService.js";

export default function Locations() {
  const [projects, setProjects] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getAllProjects(1, 1000);
      setProjects(data.projects);

      // Extract unique cities and sort them
      const uniqueCities = [
        ...new Set(
          data.projects
            .filter((p) => p.location)
            .map((p) =>
              typeof p.location === "object" ? p.location.city : p.location,
            ),
        ),
      ].sort();
      setCities(uniqueCities);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[450px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-brand-blue opacity-60 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2000"
          alt="Victoria Locations"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        <div className="container mx-auto px-6 relative z-20 text-center">
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-4">
            Victoria <span className="text-brand-gold">Locations</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto">
            Strategically selected high-growth corridors for maximum investment
            performance.
          </p>
        </div>
      </section>

      {/* Strategic Overview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-brand-gold font-black uppercase tracking-widest text-sm mb-4 block">
                Strategic Selection
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-8 uppercase tracking-tight leading-tight">
                Where Growth Meets{" "}
                <span className="text-brand-gold">Demand</span>
              </h2>
              <div className="prose prose-lg text-gray-600 space-y-6">
                <p>
                  At Dual Key Victoria, we don't just build homes; we identify
                  investment opportunities. Our team rigorously analyzes
                  population growth, infrastructure development, and rental
                  vacancy rates across Victoria.
                </p>
                <p>
                  We focus on key growth corridors like{" "}
                  <strong>Melton South</strong>, <strong>Pakenham</strong>, and
                  regional hubs where high demand for quality housing drives
                  capital appreciation and robust rental yields.
                </p>
                <div className="bg-gray-50 p-8 border-l-4 border-brand-gold rounded-r-xl mt-8">
                  <h4 className="font-black text-brand-blue uppercase text-sm mb-2 tracking-widest">
                    Why these locations?
                  </h4>
                  <ul className="list-disc list-inside text-sm space-y-2 font-medium">
                    <li>Proximity to major employment hubs</li>
                    <li>Significant Government infrastructure investment</li>
                    <li>Strong population growth exceeding state averages</li>
                    <li>Multi-generational living feasibility</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-brand-gold opacity-10 rounded-full z-0"></div>
              <img
                src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=800"
                alt="Modern Dual Key Home"
                className="rounded-3xl shadow-2xl relative z-10 border-8 border-white"
              />
              <div className="absolute -bottom-8 -left-8 bg-brand-blue p-8 rounded-2xl shadow-xl z-20 text-white max-w-[240px]">
                <p className="text-4xl font-black text-brand-gold mb-1">7.5%</p>
                <p className="text-xs uppercase font-bold tracking-widest text-gray-300">
                  Expected Max Rental Yield
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grouped Locations Grid */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-brand-blue uppercase tracking-tighter mb-4">
              Availability By <span className="text-brand-gold">City</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-gold mx-auto"></div>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            </div>
          ) : cities.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-400">
                No projects currently listed in our key locations.
              </h3>
              <p className="text-gray-500 mt-2">
                New releases are coming soon. Please contact us for off-market
                opportunities.
              </p>
            </div>
          ) : (
            cities.map((city) => (
              <div key={city} className="mb-24 last:mb-0">
                <div className="flex items-center gap-6 mb-12">
                  <h3 className="text-3xl font-black text-brand-blue uppercase tracking-tight">
                    {city}
                  </h3>
                  <div className="flex-grow h-[1px] bg-gray-200"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {projects
                    .filter((p) => {
                      const loc =
                        typeof p.location === "object"
                          ? p.location.city
                          : p.location;
                      return loc === city;
                    })
                    .map((project) => (
                      <Link
                        href={`/projects/${project.slug}`}
                        key={project._id}
                        className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col border border-gray-100"
                      >
                        <div className="h-64 relative overflow-hidden">
                          <img
                            src={
                              project.images && project.images[0]
                                ? `${image_url}${project.images[0]}`
                                : "https://images.unsplash.com/photo-1549517045-bc93de075e53?auto=format&fit=crop&q=80&w=800"
                            }
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                          />
                          <div className="absolute top-4 right-4 bg-brand-blue text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                            {city}
                          </div>
                        </div>

                        <div className="p-8 flex-grow flex flex-col">
                          <h4 className="text-xl font-bold text-brand-blue mb-3 group-hover:text-brand-gold transition capitalize">
                            {project.title}
                          </h4>
                          <p className="text-gray-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                            {project.description}
                          </p>
                          <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-brand-gold font-black tracking-tight">
                              {project.priceRange &&
                              (project.priceRange.min || project.priceRange.max)
                                ? `${project.priceRange.min ? `$${Number(project.priceRange.min).toLocaleString()}` : ""}`
                                : project.associateOnly
                                  ? "Restricted"
                                  : "Contact for Price"}
                            </span>
                            <span className="text-brand-blue font-black text-[10px] uppercase tracking-widest border-b-2 border-brand-gold pb-1 group-hover:bg-brand-gold group-hover:px-2 transition-all">
                              View Project
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
