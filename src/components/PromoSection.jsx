'use client';

import React from 'react';
import { Award, Sparkles, RefreshCw, Gift, MapPin, Phone, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PromoSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-[#1c0507]">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#dfba6b]/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-900/10 rounded-full filter blur-3xl pointer-events-none"></div>
      
      {/* Subtle border detail */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#dfba6b]/30 to-transparent"></div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#dfba6b]/30 to-transparent"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Offer Flyer Image with Premium Visual Effects */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group max-w-md w-full">
              {/* Golden gradient glow behind the flyer */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#dfba6b] via-red-800 to-[#dfba6b] rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500 group-hover:duration-200"></div>
              
              <div className="relative overflow-hidden rounded-xl bg-[#130304] border border-[#dfba6b]/20 p-2 shadow-2xl">
                <img
                  src="/images/summer_offer.jpg"
                  alt="Nalli Silk Centre Summer Offer - Buy 1 Get 1 Free Cotton Sarees"
                  className="w-full h-auto rounded-lg object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>

          {/* Right Side: Copy & Store Info */}
          <div className="lg:col-span-7 text-white">
            <span 
              className="inline-block text-[#dfba6b] text-xs font-bold uppercase tracking-[0.3em] mb-4 border border-[#dfba6b]/20 px-3 py-1 bg-[#dfba6b]/5 rounded-full"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Limited Time Summer Deal
            </span>
            
            <h2 
              className="text-3xl md:text-5xl font-bold font-serif leading-tight text-[#dfba6b] mb-4 uppercase tracking-wider"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              Mega Summer Offer!
            </h2>
            
            <p className="text-xl md:text-2xl font-light text-gray-200 mb-6 font-serif leading-relaxed">
              Buy 1 Get 1 <span className="text-[#dfba6b] font-semibold underline decoration-[#dfba6b]/40 underline-offset-8">FREE</span> on Premium Cotton Sarees.
            </p>

            <div className="flex items-baseline gap-4 mb-8 bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-sm max-w-xl">
              <span className="text-sm text-gray-300 uppercase tracking-wider font-semibold" style={{ fontFamily: "'Montserrat', sans-serif" }}>Offer Price:</span>
              <span className="text-3xl md:text-4xl font-bold text-[#dfba6b]" style={{ fontFamily: "'Outfit', sans-serif" }}>₹795</span>
              <span className="text-sm text-gray-400 font-light">(with blouse piece, Buy 1 Get 1)</span>
            </div>

            {/* Key Features Icons List */}
            <div className="grid grid-cols-2 gap-6 mb-10 max-w-xl">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#dfba6b]/10 border border-[#dfba6b]/20 text-[#dfba6b]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Guaranteed Quality</h4>
                  <p className="text-xs text-gray-400 font-light">தரம் உறுதி</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#dfba6b]/10 border border-[#dfba6b]/20 text-[#dfba6b]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Neat Designs</h4>
                  <p className="text-xs text-gray-400 font-light">நேர்த்தியான டிசைன்கள்</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#dfba6b]/10 border border-[#dfba6b]/20 text-[#dfba6b]">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">New Designs Daily</h4>
                  <p className="text-xs text-gray-400 font-light">புதிய டிசைன்கள் தினமும்</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#dfba6b]/10 border border-[#dfba6b]/20 text-[#dfba6b]">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Perfect for Gifting</h4>
                  <p className="text-xs text-gray-400 font-light">பரிசுகளுக்கு ஏற்றது</p>
                </div>
              </div>
            </div>

            {/* Address & Store Info */}
            <div className="border-t border-[#dfba6b]/10 pt-8 max-w-xl mb-10">
              <h5 className="text-[#dfba6b] uppercase tracking-widest text-xs font-bold mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>Adyar Store Details</h5>
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-sm text-gray-300">
                  <MapPin className="w-5 h-5 text-[#dfba6b] shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-light">
                    <strong>Nalli Silks Center</strong><br />
                    15/11, Second Main Road, Nehru Nagar, Adyar,<br />
                    Chennai - 600020
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Phone className="w-5 h-5 text-[#dfba6b] shrink-0" />
                  <a href="tel:+917845471962" className="hover:text-[#dfba6b] transition-colors duration-300 font-medium">
                    +91 78454 71962
                  </a>
                </div>
              </div>
            </div>

            {/* Call To Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/category/Cotton" 
                className="inline-flex items-center justify-center gap-2 bg-[#dfba6b] hover:bg-[#cdaf5f] text-[#1c0507] px-6 py-3.5 uppercase tracking-widest text-xs font-bold transition-all duration-300 shadow-lg"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Shop Cotton Collection <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a 
                href="https://maps.google.com/?q=Nalli+Silk+Centre+Adyar+15/11+2nd+Main+Road+Nehru+Nagar+Chennai+600020"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 hover:border-white hover:bg-white/5 text-white px-6 py-3.5 uppercase tracking-widest text-xs font-bold transition-all duration-300"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Get Directions <MapPin className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
