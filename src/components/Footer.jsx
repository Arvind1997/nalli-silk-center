import React from 'react';

export default function Footer() {
  return (
    <footer className="relative z-10 bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & Location */}
          <div>
            <h2 className="text-2xl font-display font-bold uppercase tracking-wider mb-6 text-[#dfba6b]">
              Nalli Silk Center
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              A legacy of purity and tradition. Bringing you the finest handwoven silks from across India since 1928.
            </p>
            
            <div className="mb-6">
              <h3 className="text-white font-semibold uppercase tracking-wider mb-3 text-sm">Flagship Store Location</h3>
              <a 
                href="https://www.google.com/maps/place/NALLI+Silk+Centre/@13.0037227,80.2517611,19z/data=!4m6!3m5!1s0x3a5267579605a6ab:0xb5babca08dc5a221!8m2!3d13.003749!4d80.2518574!16s%2Fg%2F11lgx5sjhc?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 leading-relaxed hover:text-white transition-colors block group"
              >
                Nalli Silk Centre<br />
                Dev Apartments, 18, Kasturba Nagar 3rd Cross St<br />
                Old Narasingapuram, Kasturba Nagar, Adyar<br />
                Chennai, Tamil Nadu 600020, India<br />
                <span className="text-[#dfba6b] mt-2 inline-block group-hover:underline">View on Google Maps &rarr;</span>
              </a>
            </div>

            <div className="mb-6">
              <h3 className="text-white font-semibold uppercase tracking-wider mb-3 text-sm">Contact Us</h3>
              <div className="text-sm text-gray-400 space-y-2">
                <p>
                  <a href="mailto:parimalakupuswaming@gmail.com" className="hover:text-white transition-colors">
                    parimalakupuswaming@gmail.com
                  </a>
                </p>
                <p>
                  <a href="tel:+919361292459" className="hover:text-white transition-colors">
                    +91 93612 92459
                  </a>
                </p>
              </div>
            </div>

            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Youtube</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="https://www.google.com/maps/place/NALLI+Silk+Centre/@13.0037227,80.2517611,19z/data=!4m6!3m5!1s0x3a5267579605a6ab:0xb5babca08dc5a221!8m2!3d13.003749!4d80.2518574!16s%2Fg%2F11lgx5sjhc?entry=ttu&g_ep=EgoyMDI2MDUxMy4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Store Locator</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider mb-6">Policies</h3>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold uppercase tracking-wider mb-6">Newsletter</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-gray-800 border border-gray-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-gray-900 px-4 py-3 text-sm font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Nalli Silk Center. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <span>Secured Checkout</span>
            {/* Payment icons placeholder */}
            <div className="flex space-x-2">
              <div className="w-8 h-5 bg-gray-800 rounded"></div>
              <div className="w-8 h-5 bg-gray-800 rounded"></div>
              <div className="w-8 h-5 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
