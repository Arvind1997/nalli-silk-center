import React from 'react';

export default function Hero() {
  return (
    <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1583391733958-d25e07fac66a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <span className="block text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-gray-200">
          Timeless Elegance Since 1928
        </span>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight">
          The Legacy of <br className="hidden md:block"/> Pure Silk
        </h2>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
          Discover our exquisite collection of handwoven Kanchipuram and Banarasi sarees, crafted for your most precious moments.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white px-8 py-4 uppercase tracking-widest text-sm font-semibold transition-colors">
            Shop Bridal
          </button>
          <button className="w-full sm:w-auto bg-transparent border border-white hover:bg-white hover:text-black text-white px-8 py-4 uppercase tracking-widest text-sm font-semibold transition-colors">
            View Collections
          </button>
        </div>
      </div>
    </section>
  );
}
