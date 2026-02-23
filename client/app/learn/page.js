"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAllPosts, image_url } from "../../services/contentService";
import { getAllBrochures } from "../../services/brochureService";
import { Footer } from "../../components/Footer";
import Pagination from "../../components/Pagination";
import Link from "next/link";

export default function Learn() {
  const [posts, setPosts] = useState([]);
  const [brochures, setBrochures] = useState([]);
  const [activeTab, setActiveTab] = useState("articles");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "articles") {
      fetchPosts(currentPage);
    } else {
      fetchBrochures();
    }
  }, [activeTab, currentPage]);

  const fetchPosts = async (page) => {
    setLoading(true);
    try {
      const data = await getAllPosts(page, 9);
      setPosts(data.posts);
      setTotalPages(data.pages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrochures = async () => {
    setLoading(true);
    try {
      const data = await getAllBrochures();
      setBrochures(data);
    } catch (error) {
      console.error(error);
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
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-brand-blue text-white py-24 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-black opacity-30 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center -z-10"></div>
        <div className="container mx-auto px-6 relative z-10">
          <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase tracking-tighter">
            Smart <span className="text-brand-gold">Learning</span> Hub
          </h1>
          <p className="text-xl text-gray-200 font-light max-w-2xl mx-auto mb-10">
            Expert resources, investment brochures, and in-depth articles to
            guide your property journey.
          </p>

          {/* Tab Switcher */}
          <div className="inline-flex bg-white/10 backdrop-blur-md p-1 rounded-full shadow-2xl">
            <button
              onClick={() => {
                setActiveTab("articles");
                setCurrentPage(1);
              }}
              className={`px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all ${activeTab === "articles" ? "bg-brand-gold text-brand-blue shadow-lg" : "text-white hover:bg-white/10"}`}
            >
              Articles
            </button>
            <button
              onClick={() => setActiveTab("brochures")}
              className={`px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all ${activeTab === "brochures" ? "bg-brand-gold text-brand-blue shadow-lg" : "text-white hover:bg-white/10"}`}
            >
              Brochures
            </button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 bg-gray-50 flex-grow">
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            </div>
          ) : activeTab === "articles" ? (
            <>
              {posts.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  No articles available yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {posts.map((post) => (
                    <article
                      key={post._id}
                      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col border border-gray-100"
                    >
                      <div className="h-56 relative overflow-hidden">
                        <img
                          src={`${image_url}${post.image}`}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-brand-gold text-brand-blue text-[10px] font-black px-3 py-1 uppercase tracking-widest rounded-sm">
                          Article
                        </div>
                      </div>
                      <div className="p-8 flex-grow flex flex-col">
                        <p className="text-[10px] text-brand-gold font-black uppercase tracking-widest mb-3">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                        <h3 className="text-xl font-bold text-brand-blue mb-4 group-hover:text-brand-gold transition line-clamp-2 leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">
                          {post.content}
                        </p>
                        <Link
                          href={`/blog/${post._id}`}
                          className="mt-auto text-brand-blue font-black text-xs uppercase tracking-widest border-b-2 border-brand-gold pb-1 self-start group-hover:bg-brand-gold group-hover:px-2 transition-all"
                        >
                          Read Full Article
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {brochures.length === 0 ? (
                <div className="col-span-full text-center py-20 text-gray-400">
                  No brochures available at this time.
                </div>
              ) : (
                brochures.map((b) => (
                  <div
                    key={b.id || b._id}
                    className="group bg-white p-6 rounded-3xl shadow-lg border-2 border-transparent hover:border-brand-gold transition duration-500 text-center flex flex-col items-center"
                  >
                    <div className="w-full h-40 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-brand-gold/10 transition duration-500 overflow-hidden relative">
                      {b.thumbnail ? (
                        <img
                          src={`${image_url}/${b.thumbnail}`}
                          alt={b.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />
                      ) : (
                        <svg
                          className="w-12 h-12 text-brand-gold group-hover:scale-110 transition"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          ></path>
                        </svg>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-brand-blue mb-2 tracking-tight line-clamp-2 uppercase h-14">
                      {b.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-6">
                      {b.category || "General Resource"}
                    </p>
                    <a
                      href={`${image_url}/${b.file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-brand-blue text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-gold transition shadow-md hover:shadow-xl group-hover:scale-105"
                    >
                      Read Brochure
                    </a>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
