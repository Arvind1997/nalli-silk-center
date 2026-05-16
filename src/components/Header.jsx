import React from 'react';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile menu button */}
        <button className="lg:hidden p-2 text-gray-600 hover:text-red-700">
          <Menu className="w-6 h-6" />
        </button>

        {/* Logo */}
        <div className="text-center flex-1 lg:flex-none">
          <a href="/" className="inline-block">
            <h1 className="text-3xl font-serif text-red-800 tracking-wider uppercase font-bold">
              Nalli
            </h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Silk Center</p>
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex flex-1 justify-center mx-8">
          <ul className="flex space-x-8 text-sm font-medium tracking-wide text-gray-700 uppercase">
            <li><a href="#" className="hover:text-red-700 transition-colors py-2 border-b-2 border-transparent hover:border-red-700">Kanchipuram</a></li>
            <li><a href="#" className="hover:text-red-700 transition-colors py-2 border-b-2 border-transparent hover:border-red-700">Banarasi</a></li>
            <li><a href="#" className="hover:text-red-700 transition-colors py-2 border-b-2 border-transparent hover:border-red-700">Soft Silk</a></li>
            <li><a href="#" className="hover:text-red-700 transition-colors py-2 border-b-2 border-transparent hover:border-red-700">Bridal</a></li>
            <li><a href="#" className="hover:text-red-700 transition-colors py-2 border-b-2 border-transparent hover:border-red-700">New Arrivals</a></li>
          </ul>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-4 lg:space-x-6 text-gray-600">
          <button className="hover:text-red-700 transition-colors hidden sm:block">
            <Search className="w-5 h-5" />
          </button>
          <button className="hover:text-red-700 transition-colors hidden sm:block">
            <User className="w-5 h-5" />
          </button>
          <button className="hover:text-red-700 transition-colors relative">
            <ShoppingBag className="w-5 h-5" />
            <span className="absolute -top-2 -right-2 bg-red-700 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
