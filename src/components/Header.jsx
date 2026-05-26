'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Menu, User, LogOut, X } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const SubtleSilkPattern = () => (
  <svg className="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="seamless-mandala" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <g stroke="#dfba6b" strokeWidth="0.4" fill="none">
          <circle cx="60" cy="60" r="50" />
          <circle cx="60" cy="60" r="40" strokeDasharray="3 3" />
          <circle cx="60" cy="60" r="30" />
          <path d="M60 30 Q 70 45 60 60 Q 50 45 60 30" />
          <path d="M60 90 Q 70 75 60 60 Q 50 75 60 90" />
          <path d="M30 60 Q 45 70 60 60 Q 45 50 30 60" />
          <path d="M90 60 Q 75 70 60 60 Q 75 50 90 60" />
          <circle cx="60" cy="60" r="10" />

          {/* Interlocking corner details */}
          <circle cx="0" cy="0" r="35" />
          <circle cx="120" cy="0" r="35" />
          <circle cx="0" cy="120" r="35" />
          <circle cx="120" cy="120" r="35" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#seamless-mandala)" />
  </svg>
);

export default function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top Contact Bar (slides out on scroll) */}
      <div 
        className={`bg-[#130304] text-[#dfba6b] px-4 text-xs tracking-[0.15em] font-medium flex justify-center md:justify-end items-center space-x-6 z-50 relative border-b border-[#dfba6b]/10 transition-all duration-300 ${
          scrolled ? 'h-0 py-0 border-none opacity-0 overflow-hidden' : 'h-9 py-2'
        }`}
      >
        <a href="mailto:parimalakupuswaming@gmail.com" className="hover:text-white transition-colors duration-300 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          parimalakupuswaming@gmail.com
        </a>
        <span className="text-[#dfba6b]/30 hidden md:inline">|</span>
        <a href="tel:+919361292459" className="hover:text-white transition-colors duration-300 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>
          +91 93612 92459
        </a>
      </div>

      <header 
        className={`sticky top-0 z-40 bg-[#1c0507]/95 backdrop-blur-md border-b border-[#dfba6b]/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 ${
          scrolled ? 'h-20 lg:h-22' : 'h-24 lg:h-36'
        }`}
      >
        {/* Subtle Silk Mandala Background watermark */}
        <SubtleSilkPattern />

        {/* Desktop Double-Decker Layout */}
        <div className="hidden lg:flex relative z-10 container mx-auto px-6 h-full flex-col justify-center">
          {/* Top Row (Logo, Search, Actions) */}
          <div className={`flex items-center justify-between w-full transition-all duration-300 ${scrolled ? 'h-full' : 'h-1/2'}`}>
            
            {/* Search Bar - Left */}
            <div className="flex-1 flex items-center justify-start">
              <div className="relative flex items-center group max-w-xs">
                <input 
                  type="text" 
                  placeholder="Search Silk Sarees..." 
                  className={`bg-white/5 border border-[#dfba6b]/20 focus:border-[#dfba6b] focus:bg-white/10 rounded-full pl-9 pr-4 text-xs text-white placeholder-gray-400 focus:outline-none transition-all duration-300 ${
                    scrolled ? 'py-1 w-40 focus:w-52' : 'py-1.5 w-48 focus:w-60'
                  }`}
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                />
                <Search className="w-4 h-4 text-[#dfba6b]/60 group-focus-within:text-[#dfba6b] absolute left-3 transition-colors duration-300" />
              </div>
            </div>

            {/* Logo - Center */}
            <div className="flex-none flex justify-center text-center">
              <Link href="/" className="flex flex-col items-center group">
                <span 
                  className={`font-extrabold tracking-[0.08em] text-[#dfba6b] leading-none transition-all duration-300 group-hover:scale-105 ${
                    scrolled ? 'text-2.5xl mb-0' : 'text-3.5xl lg:text-4xl mb-0.5'
                  }`} 
                  style={{ fontFamily: "'Cinzel', Georgia, serif" }}
                >
                  Nalli
                </span>
                <span 
                  className={`font-semibold tracking-[0.5em] text-[#dfba6b]/80 uppercase pt-0.5 border-t border-[#dfba6b]/20 text-center transition-all duration-300 ${
                    scrolled ? 'text-[7px] mt-0.5' : 'text-[8px] mt-1'
                  }`} 
                  style={{ fontFamily: "'Montserrat', sans-serif", width: scrolled ? '80%' : '100%' }}
                >
                  Silk Centre
                </span>
              </Link>
            </div>

            {/* Actions - Right */}
            <div className={`flex-1 flex items-center justify-end text-gray-200 transition-all duration-300 ${scrolled ? 'space-x-5' : 'space-x-6'}`}>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-xs font-medium tracking-[0.1em] hidden md:block" style={{ fontFamily: "'Montserrat', sans-serif" }}>Hello, {user.name}</span>
                  <button 
                    onClick={logout}
                    className="hover:text-[#dfba6b] transition-colors duration-300"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hover:text-[#dfba6b] transition-colors duration-300">
                  <User className="w-5 h-5" />
                </Link>
              )}
              
              <Link href="/checkout" className="hover:text-[#dfba6b] transition-colors duration-300 relative group flex items-center justify-center p-2 rounded-full hover:bg-white/5">
                <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span 
                  className="absolute -top-0.5 -right-0.5 bg-[#dfba6b] text-[#1c0507] text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg border border-[#1c0507]/10 transition-all duration-300 group-hover:scale-105"
                  style={{ width: '22px', height: '22px', fontFamily: "'Montserrat', sans-serif" }}
                >
                  {cartCount}
                </span>
              </Link>
            </div>

          </div>

          {/* Navigation Row - Bottom (slides up and narrows spacing on scroll) */}
          <div 
            className={`flex items-center justify-center w-full transition-all duration-300 ${
              scrolled 
                ? 'h-8 border-t border-[#dfba6b]/5 mt-1 pt-1 opacity-90' 
                : 'h-1/2 border-t border-[#dfba6b]/10 mt-3 pt-3 opacity-100'
            }`}
          >
            <nav>
              <ul 
                className={`flex text-xs font-semibold uppercase tracking-[0.25em] text-gray-200 transition-all duration-300 ${
                  scrolled ? 'space-x-8 text-[11px]' : 'space-x-12'
                }`} 
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <li>
                  <Link href="/" className="relative group py-2 block">
                    <span className="group-hover:text-[#dfba6b] transition-colors duration-300">Home</span>
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#dfba6b] transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-center"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/" className="relative group py-2 block">
                    <span className="group-hover:text-[#dfba6b] transition-colors duration-300">Shop</span>
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#dfba6b] transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-center"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/" className="relative group py-2 block">
                    <span className="group-hover:text-[#dfba6b] transition-colors duration-300">About Us</span>
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#dfba6b] transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-center"></span>
                  </Link>
                </li>
                <li>
                  <Link href="/" className="relative group py-2 block">
                    <span className="group-hover:text-[#dfba6b] transition-colors duration-300">Contact</span>
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#dfba6b] transition-transform duration-300 scale-x-0 group-hover:scale-x-100 origin-center"></span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Mobile Layout (lg:hidden) - single row */}
        <div className="lg:hidden relative z-10 container mx-auto px-4 h-full flex items-center justify-between">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-200 hover:text-[#dfba6b] transition-colors duration-300"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="flex flex-col items-center group">
            <span className="text-2.5xl font-extrabold tracking-[0.08em] text-[#dfba6b] leading-none mb-0.5" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
              Nalli
            </span>
            <span className="text-[7px] font-semibold tracking-[0.3em] text-[#dfba6b]/80 uppercase pt-0.5 border-t border-[#dfba6b]/20 w-full text-center" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Silk Centre
            </span>
          </Link>

          <Link href="/checkout" className="hover:text-[#dfba6b] transition-colors duration-300 relative group flex items-center justify-center p-2 rounded-full hover:bg-white/5">
            <ShoppingBag className="w-6 h-6" />
            <span 
              className="absolute -top-0.5 -right-0.5 bg-[#dfba6b] text-[#1c0507] text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg border border-[#1c0507]/10"
              style={{ width: '22px', height: '22px', fontFamily: "'Montserrat', sans-serif" }}
            >
              {cartCount}
            </span>
          </Link>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      <div className={`fixed inset-0 z-50 transition-all duration-500 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop blur */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsMobileMenuOpen(false)}></div>
        
        {/* Content Drawer */}
        <div 
          className={`absolute top-0 left-0 w-[80%] max-w-sm h-full bg-[#1c0507] border-r border-[#dfba6b]/20 p-8 flex flex-col justify-between shadow-2xl transition-transform duration-500 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            {/* Header / Brand in Drawer */}
            <div className="flex items-center justify-between pb-6 border-b border-[#dfba6b]/10">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex flex-col">
                <span className="text-2xl font-bold tracking-[0.08em] text-[#dfba6b]" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
                  Nalli
                </span>
                <span className="text-[7px] font-semibold tracking-[0.3em] text-[#dfba6b]/80 uppercase pt-0.5 border-t border-[#dfba6b]/20 mt-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  Silk Centre
                </span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-[#dfba6b] transition-colors duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Search input inside drawer */}
            <div className="relative mt-6 flex items-center w-full">
              <input 
                type="text" 
                placeholder="Search Sarees..." 
                className="bg-white/5 border border-[#dfba6b]/20 focus:border-[#dfba6b] focus:bg-white/10 rounded-full py-2 pl-9 pr-4 text-xs text-white placeholder-gray-400 focus:outline-none transition-all duration-300 w-full"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              />
              <Search className="w-4 h-4 text-[#dfba6b]/60 absolute left-3" />
            </div>

            {/* Navigation links */}
            <nav className="mt-8">
              <ul className="space-y-6 text-sm font-semibold tracking-[0.25em] text-gray-200 uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <li>
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-[#dfba6b] transition-colors duration-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-[#dfba6b] transition-colors duration-300">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-[#dfba6b] transition-colors duration-300">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-[#dfba6b] transition-colors duration-300">
                    Contact
                  </Link>
                </li>
                {user ? (
                  <li className="border-t border-[#dfba6b]/10 pt-6">
                    <span className="block text-xs text-gray-400 font-medium normal-case tracking-normal mb-2">Logged in as {user.name}</span>
                    <button 
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left py-2 hover:text-[#dfba6b] transition-colors duration-300"
                    >
                      Logout
                    </button>
                  </li>
                ) : (
                  <li className="border-t border-[#dfba6b]/10 pt-6">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 hover:text-[#dfba6b] transition-colors duration-300">
                      Login / Account
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>

          {/* Contact Details at bottom of Drawer */}
          <div className="border-t border-[#dfba6b]/10 pt-6 mt-auto">
            <p className="text-[10px] text-[#dfba6b]/60 uppercase tracking-[0.15em] mb-2 font-medium" style={{ fontFamily: "'Montserrat', sans-serif" }}>Contact Us</p>
            <a href="mailto:parimalakupuswaming@gmail.com" className="block text-xs text-gray-300 hover:text-white mb-2 transition-colors duration-300" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              parimalakupuswaming@gmail.com
            </a>
            <a href="tel:+919361292459" className="block text-xs text-gray-300 hover:text-white transition-colors duration-300" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              +91 93612 92459
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
