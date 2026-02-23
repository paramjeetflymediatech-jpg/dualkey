"use client";
import { useContext, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { image_url } from "../../../services/contentService";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { AuthContext } from "../../../context/AuthContext";
import Navbar from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import api from "../../../services/api";

const MapPicker = dynamic(() => import("../../../components/MapPicker"), {
  ssr: false,
  loading: () => (
    <p className="text-gray-400 text-xs font-bold animate-pulse">
      Initializing Positioning System...
    </p>
  ),
});

export default function ProjectDetails() {
  const { slug } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);

  useEffect(() => {
    api
      .get(`/projects/slug/${slug}`)
      .then((res) => {
        setProject(res.data);
      })
      .catch((error) => {
        console.error(error.response?.data?.message || error.message);
      });
  }, [slug]);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
      </div>
    );
  }

  const isAccessApproved =
    !project.associateOnly ||
    (project.associateOnly && project.accessStatus === "approved") ||
    user?.role === "admin";

  const priceRangeString =
    project.priceRange && (project.priceRange.min || project.priceRange.max)
      ? `${project.priceRange.min ? `$${Number(project.priceRange.min).toLocaleString()}` : ""} ${project.priceRange.min && project.priceRange.max ? "-" : ""} ${project.priceRange.max ? `$${Number(project.priceRange.max).toLocaleString()}` : ""}`
      : "POA";

  return (
    <>
      <Navbar />
      <div className="bg-white min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-end">
          <div className="absolute inset-0 z-0">
            <img
              src={
                project.images?.[0]
                  ? `${image_url}${project.images[0]}`
                  : "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80"
              }
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
          </div>

          <div className="container mx-auto px-6 pb-20 relative z-10">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-brand-gold text-brand-blue text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.2em]">
                  {project.category}
                </span>
                <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-[0.2em] border border-white/20">
                  {project.status}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                {project.title}
              </h1>
              <div className="flex items-center gap-4 text-white/80 font-medium text-lg italic">
                <svg
                  className="w-6 h-6 text-brand-gold"
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
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <section className="py-24 container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Left Side: Story & Features */}
            <div className="lg:col-span-2 space-y-24">
              {/* Quick Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Structure
                  </span>
                  <p className="text-xl font-black text-brand-blue uppercase">
                    {project.type || "---"}
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Completion
                  </span>
                  <p className="text-xl font-black text-brand-blue uppercase">
                    {project.completionDate || "---"}
                  </p>
                </div>
                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2">
                    Available
                  </span>
                  <p className="text-xl font-black text-brand-blue uppercase">
                    {project.availableUnits || 0} Units
                  </p>
                </div>
                <div className="p-6 bg-brand-blue text-white rounded-3xl shadow-xl shadow-brand-blue/20">
                  <span className="text-[10px] font-black text-white/50 uppercase tracking-widest block mb-2 italic">
                    Entity
                  </span>
                  <p className="text-lg font-black truncate">
                    {project.developer || "Exclusive"}
                  </p>
                </div>
              </div>

              {/* The Story */}
              <div className="space-y-8">
                <h2 className="text-3xl font-black text-brand-blue uppercase tracking-tight flex items-center gap-4">
                  The Vision
                  <span className="h-[2px] flex-1 bg-gray-100 hidden md:block"></span>
                </h2>
                <div className="prose prose-xl max-w-none text-gray-600 font-serif leading-relaxed italic whitespace-pre-line">
                  {project.description}
                </div>
              </div>

              {/* Features & Amenities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h3 className="text-sm font-black text-brand-blue uppercase tracking-[0.2em] flex items-center gap-3">
                    <span className="w-6 h-6 bg-brand-gold text-brand-blue rounded flex items-center justify-center text-[10px]">
                      LT
                    </span>
                    Project Features
                  </h3>
                  <ul className="grid grid-cols-1 gap-4">
                    {(Array.isArray(project.features)
                      ? project.features
                      : project.features
                        ? JSON.parse(project.features)
                        : []
                    ).map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-4 text-gray-600 font-medium"
                      >
                        <svg
                          className="w-5 h-5 text-brand-gold flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feat}
                      </li>
                    ))}
                    {(!project.features || project.features.length === 0) && (
                      <li className="text-gray-400 italic">
                        No features recorded.
                      </li>
                    )}
                  </ul>
                </div>

                <div className="space-y-6">
                  <h3 className="text-sm font-black text-brand-blue uppercase tracking-[0.2em] flex items-center gap-3">
                    <span className="w-6 h-6 bg-brand-blue text-white rounded flex items-center justify-center text-[10px]">
                      AM
                    </span>
                    Nearby Amenities
                  </h3>
                  <ul className="grid grid-cols-1 gap-4">
                    {(Array.isArray(project.amenitiesNearby)
                      ? project.amenitiesNearby
                      : project.amenitiesNearby
                        ? JSON.parse(project.amenitiesNearby)
                        : []
                    ).map((amen, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-4 text-gray-600 font-medium"
                      >
                        <svg
                          className="w-5 h-5 text-brand-blue flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {amen}
                      </li>
                    ))}
                    {(!project.amenitiesNearby ||
                      project.amenitiesNearby.length === 0) && (
                      <li className="text-gray-400 italic">
                        No amenities recorded.
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Full Gallery */}
              {isAccessApproved &&
                project.images &&
                project.images.length > 0 && (
                  <div className="space-y-8 pt-12">
                    <h2 className="text-3xl font-black text-brand-blue uppercase tracking-tight flex items-center gap-4">
                      Gallery
                      <span className="h-[2px] flex-1 bg-gray-100 hidden md:block"></span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {project.images.map((img, i) => (
                        <div
                          key={i}
                          className={`relative group overflow-hidden rounded-[2rem] shadow-lg ${i === 0 ? "md:col-span-2 md:row-span-2 aspect-square md:aspect-[4/3]" : "aspect-square"}`}
                        >
                          <img
                            src={`${image_url}${img}`}
                            alt={`${project.title} - ${i + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>

            {/* Right Side: Pricing & Inquiry Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                {/* Pricing Card */}
                <div className="bg-brand-blue p-10 rounded-[3rem] shadow-2xl shadow-brand-blue/30 text-white border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>

                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-gold block mb-4">
                    Investment Scale
                  </span>
                  <h3 className="text-4xl font-black mb-8">
                    {isAccessApproved ? priceRangeString : "RESTRICTED"}
                  </h3>

                  {isAccessApproved ? (
                    <div className="space-y-6 pt-6 border-t border-white/10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-brand-gold"
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
                        <div>
                          <p className="text-[10px] font-black uppercase text-white/40">
                            Security
                          </p>
                          <p className="text-sm font-bold">Verified Asset</p>
                        </div>
                      </div>
                      <Link
                        href="/contact"
                        className="block w-full text-center bg-brand-gold text-brand-blue font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl hover:scale-105 transition-transform"
                      >
                        Enquire Now
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6 pt-6 border-t border-white/10">
                      <p className="text-sm text-white/60 font-medium italic">
                        This is an exclusive business asset. Financial details
                        and full gallery are reserved for approved partners.
                      </p>

                      {project.accessStatus === "pending" ? (
                        <div className="bg-brand-gold/20 text-brand-gold p-4 rounded-xl border border-brand-gold/30 text-xs font-bold text-center">
                          REQUEST PENDING APPROVAL
                        </div>
                      ) : project.accessStatus === "rejected" ? (
                        <div className="bg-red-500/20 text-red-200 p-4 rounded-xl border border-red-500/30 text-xs font-bold text-center uppercase tracking-widest">
                          Access Denied
                        </div>
                      ) : (
                        <button
                          onClick={() =>
                            api
                              .post("/access", {
                                projectId: project.id || project._id,
                              })
                              .then(() => {
                                toast.success("Access requested!");
                                window.location.reload();
                              })
                              .catch((error) => {
                                console.error(
                                  error.response?.data?.message ||
                                    error.message,
                                );
                                toast.error("Failed to request access");
                              })
                          }
                          className="block w-full bg-white text-brand-blue font-black uppercase text-xs tracking-[0.2em] py-5 rounded-2xl hover:bg-brand-gold transition-colors"
                        >
                          Request Partner Access
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Location Mini Card */}
                <div className="bg-gray-50 p-8 rounded-[3rem] border border-gray-100 space-y-8 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-brand-blue/20">
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

                  <div className="space-y-6">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-2 italic">
                        Legal Address
                      </span>
                      <p className="text-lg font-bold text-gray-800 leading-tight">
                        {project.location?.address}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1">
                          Suburb
                        </span>
                        <p className="font-black text-brand-blue uppercase text-sm">
                          {project.location?.city || "---"}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 block mb-1">
                          State
                        </span>
                        <p className="font-black text-brand-blue uppercase text-sm">
                          {project.location?.state || "---"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="aspect-square bg-white rounded-[2rem] border border-gray-100 overflow-hidden relative group shadow-inner">
                    {project.location?.coordinates?.lat ? (
                      <MapPicker
                        initialLat={project.location.coordinates.lat}
                        initialLng={project.location.coordinates.lng}
                        onLocationSelect={() => {}} // Read-only for public view
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                        <svg
                          className="w-10 h-10 text-brand-gold"
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer CTA Section */}
        <section className="bg-gray-50 py-24">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            <span className="text-[10px] font-black text-brand-gold uppercase tracking-[0.5em] block mb-6">
              Discovery Phase
            </span>
            <h2 className="text-4xl font-black text-brand-blue uppercase tracking-tight mb-8">
              Looking for more opportunities?
            </h2>
            <Link
              href="/projects"
              className="inline-block bg-brand-blue text-brand-gold px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-brand-blue/20 hover:-translate-y-1 transition-all"
            >
              Explore Portfolio
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
