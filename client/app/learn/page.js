"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getAllPosts, image_url } from "../../services/contentService";

import Pagination from "../../components/Pagination";

export default function Learn() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page) => {
    try {
      const data = await getAllPosts(page, 9); // Limit 9 for grid 3x3
      setPosts(data.posts);
      setTotalPages(data.pages);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch posts");
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
          Learn
        </h1>
        <p className="text-lg text-gray-600 mb-12 max-w-3xl">
          Stay informed with the latest insights, news, and educational
          resources about property investment.
        </p>

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl text-gray-400">
              No articles available yet. Check back soon!
            </h3>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <img
                        src={`${image_url}${post.image}`}
                        width={100}
                        height={50}
                        alt={post.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-3 text-brand-blue line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                      {post.content}
                    </p>
                    <button className="text-brand-gold font-bold hover:underline mt-auto self-start">
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}
