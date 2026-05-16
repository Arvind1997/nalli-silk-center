'use client';

import React from 'react';
import { ShoppingBag, Search, Menu, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const SeamlessMandalaPattern = () => (
  <svg className="absolute inset-0 z-0 pointer-events-none w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="seamless-mandala" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        <g stroke="#fca311" strokeWidth="0.75" fill="none">
          {/* Main central mandala */}
          <circle cx="60" cy="60" r="50" />
          <circle cx="60" cy="60" r="40" strokeDasharray="4 4" />
          <circle cx="60" cy="60" r="30" />
          <path d="M60 30 Q 70 45 60 60 Q 50 45 60 30" />
          <path d="M60 90 Q 70 75 60 60 Q 50 75 60 90" />
          <path d="M30 60 Q 45 70 60 60 Q 45 50 30 60" />
          <path d="M90 60 Q 75 70 60 60 Q 75 50 90 60" />
          <circle cx="60" cy="60" r="10" fill="rgba(252, 163, 17, 0.1)" />

          {/* Corner overlapping mandalas to create interlocking effect */}
          <circle cx="0" cy="0" r="35" />
          <circle cx="120" cy="0" r="35" />
          <circle cx="0" cy="120" r="35" />
          <circle cx="120" cy="120" r="35" />
          
          <circle cx="0" cy="0" r="25" strokeDasharray="3 3" />
          <circle cx="120" cy="0" r="25" strokeDasharray="3 3" />
          <circle cx="0" cy="120" r="25" strokeDasharray="3 3" />
          <circle cx="120" cy="120" r="25" strokeDasharray="3 3" />
        </g>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#seamless-mandala)" />
  </svg>
);

export default function Header() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-[#8b0000] text-[#fca311] py-1.5 px-4 text-xs md:text-sm font-medium tracking-wider flex justify-center md:justify-end items-center space-x-6 z-50 relative">
        <a href="mailto:parimalakupuswaming@gmail.com" className="hover:text-white transition-colors">
          parimalakupuswaming@gmail.com
        </a>
        <a href="tel:+919361292459" className="hover:text-white transition-colors">
          +91 93612 92459
        </a>
      </div>

      <header className="sticky top-0 z-40 shadow-2xl border-b border-red-700/30 bg-[#eb1d27] overflow-hidden">
        {/* Background Seamless Pattern */}
        <SeamlessMandalaPattern />

        <div className="relative z-10 container mx-auto px-4 h-24 flex items-center justify-between">
          {/* Navigation - Left Side */}
          <nav className="hidden lg:flex flex-1 items-center">
            <ul className="flex space-x-8 text-sm font-bold tracking-[0.1em] text-white uppercase">
              <li><Link href="/" className="hover:text-yellow-200 transition-colors drop-shadow-md">Home</Link></li>
              <li><Link href="/" className="hover:text-yellow-400 transition-colors drop-shadow-md">Shop</Link></li>
              <li><Link href="/" className="hover:text-yellow-200 transition-colors drop-shadow-md">About Us</Link></li>
              <li><Link href="/" className="hover:text-yellow-200 transition-colors drop-shadow-md">Contact</Link></li>
            </ul>
          </nav>

          {/* Mobile menu button */}
          <button className="lg:hidden p-2 text-white hover:text-yellow-200">
            <Menu className="w-6 h-6" />
          </button>

          {/* Custom Nalli Logo - Center */}
          <div className="flex-none flex justify-center px-6">
            <Link href="/" className="relative group">
              <div className="bg-white px-7 py-2.5 rounded-sm border-[4px] border-white relative shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] group-hover:scale-105 transition-transform duration-500 ease-out">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-black tracking-tighter text-[#eb1d27] leading-none mb-0.5" style={{ fontFamily: 'ui-serif, Georgia, serif' }}>
                    Nalli
                  </span>
                  <span className="text-[9px] font-black tracking-[0.25em] text-[#eb1d27] uppercase border-t border-[#eb1d27]/20 pt-1 mt-1">
                    Silk Centre
                  </span>
                </div>
                {/* Refined side notches */}
                <div className="absolute top-1/2 -left-2.5 -translate-y-1/2 w-5 h-5 bg-[#eb1d27] rotate-45 border-r border-b border-white/20"></div>
                <div className="absolute top-1/2 -right-2.5 -translate-y-1/2 w-5 h-5 bg-[#eb1d27] rotate-45 border-l border-t border-white/20"></div>
              </div>
            </Link>
          </div>

          {/* Icons & User - Right Side */}
          <div className="flex flex-1 items-center justify-end space-x-4 lg:space-x-8 text-white">
            <button className="hover:text-yellow-200 transition-colors hidden sm:block">
              <Search className="w-5 h-5 drop-shadow-lg" />
            </button>
            
            <div className="flex items-center space-x-5">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-semibold hidden md:block drop-shadow-md">Hello, {user.name}</span>
                  <button 
                    onClick={logout}
                    className="hover:text-yellow-200 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 drop-shadow-lg" />
                  </button>
                </div>
              ) : (
                <Link href="/login" className="hover:text-yellow-200 transition-colors hidden sm:block">
                  <User className="w-5 h-5 drop-shadow-lg" />
                </Link>
              )}
              
              <Link href="/checkout" className="hover:text-yellow-200 transition-colors relative group flex items-center justify-center p-2 rounded-full hover:bg-white/10">
                <ShoppingBag className="w-6 h-6 drop-shadow-lg" />
                <span className="absolute -top-2 -right-2 bg-white text-[#eb1d27] text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-lg">
                  {cartCount}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
