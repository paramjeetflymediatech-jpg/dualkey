"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import { Footer } from "../../components/Footer";
import { getAllPosts } from "../../services/contentService";
import Pagination from "../../components/Pagination";

export default function BlogList() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page) => {
    setLoading(true);
    try {
      const data = await getAllPosts(page, 9); // 9 per page for a 3x3 grid
      setPosts(data.posts);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Header Section */}
      <section className="bg-brand-blue text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center -z-10"></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tighter">
            Insights & <span className="text-brand-gold">Expertise</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-light max-w-2xl mx-auto">
            Stay updated with the latest trends in dual-key living and property
            investing in Victoria.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-24 bg-gray-50 flex-grow">
        <div className="container mx-auto px-6 max-w-7xl">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
            </div>
          ) : posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {posts.map((post) => (
                  <article
                    key={post._id}
                    className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition duration-500 overflow-hidden flex flex-col"
                  >
                    <Link
                      href={`/blog/${post._id}`}
                      className="block relative aspect-video overflow-hidden"
                    >
                      <img
                        src={
                          post.image
                            ? post.image.startsWith("http")
                              ? post.image
                              : `http://localhost:5000${post.image}`
                            : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=800"
                        }
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />
                      <div className="absolute top-4 left-4 bg-brand-gold text-brand-blue text-xs font-black px-3 py-1 uppercase tracking-widest rounded-sm">
                        Invest
                      </div>
                    </Link>

                    <div className="p-8 flex-grow flex flex-col">
                      <p className="text-xs text-brand-gold font-bold uppercase tracking-widest mb-3">
                        {new Date(post.createdAt).toLocaleDateString("en-AU", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <h3 className="text-2xl font-bold text-brand-blue mb-4 leading-tight group-hover:text-brand-gold transition capitalize">
                        <Link href={`/blog/${post._id}`}>{post.title}</Link>
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-3 text-sm leading-relaxed">
                        {post.content.substring(0, 160)}...
                      </p>
                      <div className="mt-auto pt-6 border-t border-gray-100 flex justify-between items-center">
                        <Link
                          href={`/blog/${post._id}`}
                          className="text-brand-blue font-black text-sm uppercase tracking-widest border-b-2 border-brand-gold pb-1 group-hover:bg-brand-gold group-hover:px-2 transition-all"
                        >
                          Read Story
                        </Link>
                        <span className="text-xs text-gray-400 font-medium italic">
                          5 min read
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-20 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <h3 className="text-2xl font-bold text-gray-400">
                No blog posts published yet.
              </h3>
              <p className="text-gray-500 mt-2">
                Please check back later for exciting updates.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
