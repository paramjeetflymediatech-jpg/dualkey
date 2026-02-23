"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import { Footer } from "../../../components/Footer";
import { getPostById } from "../../../services/contentService";

export default function BlogPostView({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;
  const router = useRouter();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getPostById(id);
        setPost(data);
      } catch (error) {
        console.error("Failed to fetch post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-gold"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex flex-col justify-center items-center py-24 text-center">
          <h1 className="text-4xl font-bold text-brand-blue mb-4">
            Post Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The blog post you are looking for might have been moved or deleted.
          </p>
          <Link
            href="/blog"
            className="bg-brand-blue text-white px-8 py-3 rounded font-bold hover:bg-opacity-90 transition shadow-lg"
          >
            Return to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white">
      <Navbar />

      {/* Hero Header */}
      <section className="relative w-full h-[500px] flex items-end pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10"></div>
        <img
          src={
            post.image
              ? post.image.startsWith("http")
                ? post.image
                : `http://localhost:5000${post.image}`
              : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&q=80&w=2000"
          }
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover z-0"
        />

        <div className="container mx-auto px-6 relative z-20 max-w-4xl">
          <Link
            href="/blog"
            className="text-brand-gold font-bold uppercase tracking-widest text-sm mb-6 inline-flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
          >
            ← Back to Insights
          </Link>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
            {post.title}
          </h1>
          <div className="flex items-center gap-6 mt-8 text-white/80 font-medium text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-brand-blue font-black text-xs">
                DK
              </div>
              <span>Dual Key Victoria</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold"></div>
            <span>
              {new Date(post.createdAt).toLocaleDateString("en-AU", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-24">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="prose prose-xl prose-brand max-w-none prose-headings:text-brand-blue prose-headings:font-black prose-p:text-gray-700 prose-p:leading-relaxed prose-strong:text-brand-blue prose-blockquote:border-brand-gold prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:italic">
            {/* Split content by newlines and wrap in paragraphs if they don't look like elements or already handled */}
            {post.content.split("\n").map((paragraph, index) =>
              paragraph.trim() ? (
                <p
                  key={index}
                  className="text-xl text-gray-700 leading-relaxed mb-8"
                >
                  {paragraph}
                </p>
              ) : (
                <br key={index} />
              ),
            )}
          </div>

          {/* Social Share / Footer */}
          <div className="mt-20 pt-16 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4">
              <span className="text-sm font-black text-brand-blue uppercase tracking-widest">
                Explore More
              </span>
              <div className="flex gap-2">
                <Link
                  href="/locations"
                  className="text-xs bg-gray-100 hover:bg-brand-gold px-4 py-2 rounded-full transition font-bold text-gray-600 hover:text-brand-blue"
                >
                  Locations
                </Link>
                <Link
                  href="/terrace-range"
                  className="text-xs bg-gray-100 hover:bg-brand-gold px-4 py-2 rounded-full transition font-bold text-gray-600 hover:text-brand-blue"
                >
                  Designs
                </Link>
              </div>
            </div>
            <Link
              href="/blog"
              className="bg-brand-blue text-white px-10 py-4 rounded-sm font-black text-sm uppercase tracking-widest hover:bg-brand-gold transition shadow-xl"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </article>

      {/* Suggested Reading - Simple Preview */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-3xl font-bold text-brand-blue mb-12 uppercase tracking-tight">
            Financial Benefits
          </h2>
          <div className="bg-brand-blue rounded-2xl p-12 text-white text-left relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold opacity-10 translate-x-1/2 -translate-y-1/2 rounded-full group-hover:scale-125 transition duration-1000"></div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">
              Ready to maximize your yield?
            </h3>
            <p className="text-gray-300 text-lg mb-8 max-w-xl">
              Learn how a Dual Key property can generate up to 7.5% expected
              rental yield with one property and two incomes.
            </p>
            <Link
              href="/register"
              className="inline-block bg-brand-gold text-brand-blue px-12 py-5 rounded-sm font-black text-lg hover:bg-white transition uppercase tracking-widest shadow-2xl"
            >
              Get Free Assessment
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
