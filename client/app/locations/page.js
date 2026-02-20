"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAllProjects } from "../../services/projectService";
import { image_url } from "../../services/contentService.js";
import { Footer } from "../../components/Footer";
export default function Locations() {
  const [projects, setProjects] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);
  const fetchProjects = async () => {
    try {
      const data = await getAllProjects(1, 1000); // Fetch all for grouped view
      setProjects(data.projects);

      // Extract unique locations (Cities)
      const uniqueLocations = [
        ...new Set(
          data.projects
            .filter((p) => p.location)
            .map((p) =>
              typeof p.location === "object" ? p.location.city : p.location,
            ),
        ),
      ];
      setLocations(uniqueLocations);
    } catch (error) {
      console.error("Failed to fetch projects");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-100 bg-gray-50 font-sans">
        <div className="container mx-auto p-8">
          <h1 className="text-4xl font-bold mb-8 text-brand-blue tracking-tight">
            Our Locations
          </h1>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            Discover our Dual Key properties in prime locations across Victoria.
            We carefully select areas with high growth potential and strong
            rental demand.
          </p>

          {locations.length === 0 ? (
            <p className="text-gray-500">
              No locations found with active projects.
            </p>
          ) : (
            locations.map((location) => (
              <div key={location} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-brand-blue border-b border-brand-gold inline-block pb-1">
                  {location}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects
                    .filter((p) => {
                      const loc =
                        typeof p.location === "object"
                          ? p.location.city
                          : p.location;
                      return loc === location;
                    })
                    .map((project) => (
                      <div
                        key={project._id}
                        className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                      >
                        <div className="h-48 bg-gray-200 relative">
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            <img
                              src={`${image_url}${project.images[0]}`}
                              width={100}
                              height={50}
                            />
                          </div>
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold mb-2 text-brand-blue">
                            {project.title}
                          </h3>
                          <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                            {project.description}
                          </p>
                          <p className="font-bold text-brand-gold">
                            {project.priceRange && project.priceRange.min
                              ? `$${Number(project.priceRange.min).toLocaleString()} - $${Number(project.priceRange.max).toLocaleString()}`
                              : project.price
                                ? `$${Number(project.price).toLocaleString()}`
                                : "Price upon Application"}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
