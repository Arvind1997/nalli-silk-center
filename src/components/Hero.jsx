"use client";

import React from 'react';

export default function Hero() {
  return (
    <section 
      className="relative h-[80vh] min-h-[600px] w-full overflow-hidden"
      style={{ clipPath: 'inset(0 0 0 0)' }}
    >
      {/* Fixed Background Video */}
      <video
        className="fixed top-0 left-0 w-full h-screen object-cover pointer-events-none z-0"
        src="/videos/f_df_b_ca_ec_d_f_f_mp_.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/45 z-0"></div>

      {/* Content */}
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl mx-auto">
          <span className="block text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-gray-200">
            Timeless Elegance Since 1928
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight whitespace-pre-line">
            The Legacy of {"\n"} Pure Silk
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
            Discover our exquisite collection of handwoven Kanchipuram and Banarasi sarees.
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
      </div>
    </section>
  );
}
