import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[600px] flex items-center justify-center bg-brand-blue text-white overflow-hidden">
        {/* Background Overlay (simulating dark tint over image) */}
        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
        {/* Placeholder for Background Image */}
        <div className="absolute inset-0 bg-[url('/hero-bg.jpg')] bg-cover bg-center -z-10 bg-opacity-40"></div>

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
            One Property,<br />
            <span className="text-brand-gold">Two Incomes.</span>
          </h1>
          <p className="text-lg md:text-2xl mb-10 text-gray-200">
            Maximize your investment potential with our premium Dual Key home designs.
            Perfect for investors and modern families.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              href="/register"
              className="bg-brand-gold text-brand-blue px-10 py-4 rounded-sm font-bold text-lg hover:bg-yellow-500 transition shadow-xl uppercase tracking-wide"
            >
              Start Investing
            </Link>
            <Link
              href="/login"
              className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-sm font-bold text-lg hover:bg-white hover:text-brand-blue transition uppercase tracking-wide"
            >
              View Designs
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-brand-blue mb-4">Why Choose Dual Key?</h2>
            <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-brand-blue mb-4">High Yield Returns</h3>
              <p className="text-gray-600">
                Generate two separate rental incomes from a single property title, significantly boosting your annual yield.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">👨‍👩‍👧‍👦</span>
              </div>
              <h3 className="text-xl font-bold text-brand-blue mb-4">Multi-Generational Living</h3>
              <p className="text-gray-600">
                Provide independent living spaces for elderly parents or young adults while keeping family close.
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-lg shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🏗️</span>
              </div>
              <h3 className="text-xl font-bold text-brand-blue mb-4">Smart Construction</h3>
              <p className="text-gray-600">
                Built with modern materials and energy-efficient designs to lower maintenance costs and attract quality tenants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-brand-blue text-white text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6">Ready to secure your financial future?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join hundreds of savvy investors who have already discovered the power of Dual Key properties in Victoria.
          </p>
          <Link
            href="/register"
            className="inline-block bg-brand-gold text-brand-blue px-12 py-4 rounded-sm font-bold text-lg hover:bg-yellow-500 transition shadow-lg uppercase tracking-wide"
          >
            Get Free Consultation
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-2xl font-bold text-white tracking-wider">
              DUAL<span className="text-brand-gold">KEY</span>
            </span>
            <p className="mt-2 text-sm">© 2026 Dual Key Victoria. All rights reserved.</p>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
