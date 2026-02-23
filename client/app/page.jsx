"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";
import { Footer } from "../components/Footer";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left font-bold text-brand-blue hover:text-brand-gold transition"
      >
        <span className="text-lg">{question}</span>
        <span
          className={`text-2xl transition-transform ${isOpen ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      {isOpen && <p className="mt-4 text-gray-600 leading-relaxed">{answer}</p>}
    </div>
  );
};

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[700px] flex items-center justify-center bg-brand-blue text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-60 z-0"></div>
        {/* Placeholder for Background Image */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center -z-10"></div>

        <div className="relative z-10 text-center px-6 max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            One Property,
            <br />
            <span className="text-brand-gold">Two Incomes.</span>
          </h1>
          <p className="text-xl md:text-3xl mb-12 text-gray-200 font-light">
            Dual Key Victoria will enhance the way you invest and live featuring
            two rental incomes from one property.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-brand-gold text-brand-blue px-12 py-5 rounded-sm font-bold text-lg hover:bg-yellow-500 transition shadow-2xl uppercase tracking-widest"
              >
                Access Dashboard
              </Link>
            ) : (
              <Link
                href="/register"
                className="bg-brand-gold text-brand-blue px-12 py-5 rounded-sm font-bold text-lg hover:bg-yellow-500 transition shadow-2xl uppercase tracking-widest"
              >
                Start Investing
              </Link>
            )}
            <Link
              href="/projects"
              className="bg-transparent border-2 border-white text-white px-12 py-5 rounded-sm font-bold text-lg hover:bg-white hover:text-brand-blue transition uppercase tracking-widest"
            >
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* Concept Sections - Only shown to Guests/Admins */}
      {(!user || user.role === "admin") && (
        <>
          <section className="py-24 bg-white">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="flex flex-col md:flex-row items-center gap-16">
                <div className="md:w-1/2">
                  <h2 className="text-4xl md:text-5xl font-bold text-brand-blue mb-8 leading-tight">
                    What is a{" "}
                    <span className="text-brand-gold font-black italic">
                      DK Home?
                    </span>
                  </h2>
                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    A Dual Key home features a 3-bedroom main residence and a
                    separate 1-bedroom unit under one roofline. Each residence
                    has its own independent entry, ensuring privacy and
                    convenience.
                  </p>
                  <div className="space-y-4">
                    {[
                      "Independent front entries",
                      "Separate utility connections",
                      "Private outdoor living spaces",
                      "Fire-rated common walls for safety",
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="text-brand-gold text-2xl leading-none">
                          ✓
                        </span>
                        <span className="font-semibold text-brand-blue">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:w-1/2 relative">
                  <div className="bg-brand-blue rounded-lg aspect-video overflow-hidden shadow-2xl">
                    <img
                      src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200"
                      alt="Dual Key Concept"
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                  <div className="absolute -bottom-8 -left-8 bg-brand-gold p-6 shadow-xl hidden lg:block">
                    <p className="text-brand-blue font-black text-4xl">3+1</p>
                    <p className="text-brand-blue font-bold uppercase tracking-tighter">
                      Dual Income
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Design & Quality Section */}
          <section className="py-24 bg-gray-50 overflow-hidden">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-brand-blue mb-4">
                  Design Innovation & Quality
                </h2>
                <div className="w-24 h-1 bg-brand-gold mx-auto mb-8"></div>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We focus on maximizing living space and providing premium
                  fixtures that attract high-quality tenants.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="order-2 md:order-1">
                  <img
                    src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200"
                    alt="Interior Quality"
                    className="rounded-lg shadow-xl"
                  />
                </div>
                <div className="order-1 md:order-2 space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-brand-blue mb-4">
                      Privacy Focused
                    </h3>
                    <p className="text-gray-600">
                      Each dwellng is designed to be completely self-contained
                      with separate acoustic treatments to ensure peace and
                      privacy for all residents.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-brand-blue mb-4">
                      Premium Inclusions
                    </h3>
                    <p className="text-gray-600">
                      From ducted heating and cooling to designer appliances,
                      every detail is chosen to enhance lifestyle and long-term
                      asset value.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Financial Benefits Section */}
          <section className="py-24 bg-brand-blue text-white">
            <div className="container mx-auto px-6 max-w-6xl">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <div className="lg:w-1/2">
                  <h2 className="text-4xl font-bold mb-8 leading-tight text-brand-gold">
                    Maximize Your Returns
                  </h2>
                  <div className="space-y-8">
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center shrink-0 border border-brand-gold">
                        <span className="text-xl">📈</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">
                          Cash-Flow Positive
                        </h4>
                        <p className="text-gray-300">
                          Properties are designed to be cash-flow positive from
                          day one, covering your mortgage and more.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center shrink-0 border border-brand-gold">
                        <span className="text-xl">🛡️</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">
                          One Title, Two Gems
                        </h4>
                        <p className="text-gray-300">
                          Save on land taxes and council rates by having two
                          separate dwellings on a single title.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center shrink-0 border border-brand-gold">
                        <span className="text-xl">💼</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-bold mb-2">
                          High Rental Demand
                        </h4>
                        <p className="text-gray-300">
                          Victoria's growing population and demand for
                          affordable housing make dual keys highly attractive.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lg:w-1/2 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="text-center p-8">
                    <p className="text-brand-gold text-6xl font-black mb-4 tracking-tighter">
                      7.5%+{" "}
                    </p>
                    <p className="text-2xl font-bold mb-8 uppercase tracking-widest">
                      Expected Yield
                    </p>
                    <Link
                      href="/register"
                      className="inline-block bg-white text-brand-blue px-10 py-4 rounded-sm font-black hover:bg-brand-gold transition uppercase"
                    >
                      Calculate My Returns
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Featured Projects Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-4xl font-bold text-brand-blue mb-4">
            Premium Locations
          </h2>
          <div className="w-24 h-1 bg-brand-gold mx-auto mb-16"></div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition duration-500 text-left bg-white"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={`https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800&sig=${item}`}
                    alt="Project"
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-bold text-brand-blue mb-2 uppercase tracking-wide">
                    Elite Estate {item}
                  </h4>
                  <p className="text-gray-500 mb-6 font-medium">
                    Melton South, Victoria
                  </p>
                  <Link
                    href="/locations"
                    className="text-brand-blue font-black border-b-2 border-brand-gold pb-1 group-hover:bg-brand-gold group-hover:px-2 transition-all"
                  >
                    DISCOVER MORE
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16">
            <Link
              href="/locations"
              className="px-12 py-4 border-2 border-brand-blue text-brand-blue font-black hover:bg-brand-blue hover:text-white transition uppercase tracking-widest"
            >
              View All Locations
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* FAQ Section - Only shown to Guests/Admins */}
      {(!user || user.role === "admin") && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-brand-blue mb-4 uppercase tracking-tighter">
                Frequently Asked Questions
              </h2>
              <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <FAQItem
                question="What is the expected rental return?"
                answer="Typical dual-key properties in growth areas like Melton or Pakenham can see returns significantly higher than standard homes, often exceeding 7% gross yield."
              />
              <FAQItem
                question="Do I need a large block of land?"
                answer="Minimum block sizes vary by council but generally require at least 350-400sqm to accommodate both residences and required private open spaces."
              />
              <FAQItem
                question="Are utilities separately metered?"
                answer="Yes, we ensure electricity, water, and gas are individually metered so tenants pay for their own consumption, simplifying property management."
              />
              <FAQItem
                question="How does the building contract work?"
                answer="We offer fixed-price building contracts to provide absolute certainty on your investment costs, with no hidden surprises."
              />
            </div>
          </div>
        </section>
      )}

      {/* Final Call to Action */}
      <section className="py-24 bg-brand-gold text-brand-blue text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter">
            Ready to secure your financial future?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto font-medium opacity-80">
            Join hundreds of savvy investors who have already discovered the
            power of Dual Key properties in Victoria.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-brand-blue text-white px-16 py-6 rounded-sm font-black text-xl hover:bg-opacity-90 transition shadow-2xl uppercase tracking-widest"
          >
            Get Free Consultation
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
