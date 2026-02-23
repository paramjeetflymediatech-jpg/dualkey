"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  getProjectById,
  deleteProject,
} from "../../../../services/projectService";
import { image_url } from "../../../../services/contentService";

import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("../../../../components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
      <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
        Initializing Positioning...
      </p>
    </div>
  ),
});

export default function ProjectDetails({ params }) {
  const [project, setProject] = useState(null);
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    if (id) {
      fetchProject(id);
    }
  }, [id]);

  const fetchProject = async (projectId) => {
    try {
      const data = await getProjectById(projectId);
      setProject(data);
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        router.push("/admin/projects");
      } catch (error) {
        console.error(error.response.data.message);
        alert(error.response.data.message);
      }
    }
  };

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  const priceRangeString =
    project.priceRange && (project.priceRange.min || project.priceRange.max)
      ? `${project.priceRange.min ? `$${project.priceRange.min.toLocaleString()}` : ""} ${project.priceRange.min && project.priceRange.max ? "-" : ""} ${project.priceRange.max ? `$${project.priceRange.max.toLocaleString()}` : ""}`
      : "POA";

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-brand-gold/10 text-brand-gold text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest border border-brand-gold/20">
              {project.category}
            </span>
            <span className="bg-brand-blue/5 text-brand-blue text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-widest border border-brand-blue/10">
              {project.status}
            </span>
          </div>
          <h1 className="text-4xl font-black text-brand-blue uppercase tracking-tight leading-tight">
            {project.title}
          </h1>
          <p className="text-gray-400 font-medium mt-1 flex items-center gap-2">
            <svg
              className="w-4 h-4"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {project.location?.city}, {project.location?.state}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/admin/projects/edit/${project._id || project.id}`}
            className="flex-1 md:flex-none bg-brand-blue text-white px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 transform hover:-translate-y-1 transition-all text-center"
          >
            Modify Insight
          </Link>
          <button
            onClick={handleDelete}
            className="p-4 rounded-2xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all transform hover:-translate-y-1"
            title="Purge Project"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            onClick={() => router.back()}
            className="p-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-gray-200 transition-all"
            title="Exit View"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Description */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Specs Card */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-10 pb-4 border-b border-gray-50 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-blue text-white rounded-lg flex items-center justify-center text-[10px]">
                01
              </span>
              Detailed Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  Valuation
                </span>
                <p className="text-2xl font-black text-brand-blue">
                  {priceRangeString}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  Developer Entity
                </span>
                <p className="text-xl font-bold text-gray-700">
                  {project.developer || "---"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  Structure Type
                </span>
                <p className="text-xl font-bold text-gray-700">
                  {project.type || "---"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  Expected Completion
                </span>
                <p className="text-xl font-bold text-gray-700">
                  {project.completionDate || "---"}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  Inventory Status
                </span>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-lg font-black text-brand-blue">
                      {project.availableUnits || 0}
                    </p>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                      Available
                    </span>
                  </div>
                  <div className="h-8 w-[1px] bg-gray-100"></div>
                  <div>
                    <p className="text-lg font-black text-gray-400">
                      {project.totalUnits || 0}
                    </p>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tighter">
                      Total
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                  Access Level
                </span>
                <p className="text-lg font-bold text-gray-700">
                  {project.associateOnly ? "Exclusive Asset" : "Open Access"}
                </p>
              </div>
            </div>
          </div>

          {/* Narrative Card */}
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h2 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-10 pb-4 border-b border-gray-50 flex items-center gap-3">
              <span className="w-8 h-8 bg-brand-gold text-brand-blue rounded-lg flex items-center justify-center text-[10px]">
                02
              </span>
              Strategic Overview
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600 font-serif leading-relaxed italic whitespace-pre-line">
              {project.description}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Features Card */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-[10px]">
                  FEA
                </span>
                Property Features
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.features &&
                  (Array.isArray(project.features)
                    ? project.features
                    : JSON.parse(project.features)
                  ).map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-purple-50 text-purple-700 text-[10px] font-bold uppercase rounded-full border border-purple-100"
                    >
                      {feature}
                    </span>
                  ))}
                {(!project.features || project.features.length === 0) && (
                  <p className="text-gray-400 text-xs italic">
                    No specific features recorded.
                  </p>
                )}
              </div>
            </div>

            {/* Amenities Card */}
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-6 flex items-center gap-3">
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px]">
                  AME
                </span>
                Nearby Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.amenitiesNearby &&
                  (Array.isArray(project.amenitiesNearby)
                    ? project.amenitiesNearby
                    : JSON.parse(project.amenitiesNearby)
                  ).map((amenity, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-full border border-blue-100"
                    >
                      {amenity}
                    </span>
                  ))}
                {(!project.amenitiesNearby ||
                  project.amenitiesNearby.length === 0) && (
                  <p className="text-gray-400 text-xs italic">
                    No nearby amenities recorded.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Visual Gallery Card */}
          {project.images && project.images.length > 0 && (
            <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-10 pb-4 border-b border-gray-50 flex items-center gap-3">
                <span className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center text-[10px]">
                  03
                </span>
                Asset Visualization
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.images.map((img, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-3xl group ${index === 0 ? "md:col-span-2 aspect-[16/9]" : "aspect-square"}`}
                  >
                    <img
                      src={`${image_url}${img}`}
                      alt={`Asset Visual ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <span className="text-white text-[10px] font-black uppercase tracking-widest">
                        Asset Detail #{index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Location & Side Info */}
        <div className="space-y-8">
          {/* Location Card */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center shadow-inner">
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
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block leading-none mb-1">
                  Geographic
                </span>
                <h4 className="text-xl font-black text-brand-blue uppercase tracking-tight">
                  Positioning
                </h4>
              </div>
            </div>

            <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 mb-8 aspect-square relative shadow-inner group">
              {project.location?.coordinates?.lat ? (
                <MapPicker
                  initialLat={project.location.coordinates.lat}
                  initialLng={project.location.coordinates.lng}
                  onLocationSelect={() => {}} // Read-only for public view
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 opacity-40 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-12 h-12 text-gray-200 mb-4"
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
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-loose">
                    Position Data Unavailable
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 italic">
                  Legal Address
                </span>
                <p className="text-sm font-bold text-brand-blue leading-relaxed">
                  {project.location?.address || "---"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                    Suburb
                  </span>
                  <p className="text-sm font-black text-gray-600 uppercase">
                    {project.location?.city || "---"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                    State
                  </span>
                  <p className="text-sm font-black text-gray-600 uppercase">
                    {project.location?.state || "---"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-300 uppercase">
                  Created
                </span>
                <span className="text-[10px] font-bold text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-gray-300 uppercase">
                  Last Sync
                </span>
                <span className="text-[10px] font-bold text-gray-500">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
