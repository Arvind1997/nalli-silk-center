'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { products } from '../data/products';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function FeaturedCollections() {
  const { addToCart } = useCart();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 uppercase tracking-widest">
            Featured Collections
          </h2>
          <div className="w-24 h-1 bg-red-800 mx-auto"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto font-light">
            Handpicked masterworks from our finest looms across India.
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="product-swiper pb-12"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="group relative bg-gray-50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                <Link href={`/product/${product.id}`} className="block aspect-[3/4] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-6 py-2 uppercase tracking-widest text-xs font-bold">
                      View Details
                    </span>
                  </div>
                </Link>
                <div className="p-6">
                  <span className="text-xs text-red-700 font-semibold uppercase tracking-widest block mb-2">
                    {product.category}
                  </span>
                  <Link href={`/product/${product.id}`} className="block">
                    <h3 className="text-lg font-serif font-bold text-gray-900 mb-2 group-hover:text-red-800 transition-colors truncate">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xl font-medium text-gray-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <button 
                      onClick={() => addToCart(product)}
                      className="p-2 rounded-full bg-red-800 text-white hover:bg-red-900 transition-colors shadow-md"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .product-swiper .swiper-button-next,
        .product-swiper .swiper-button-prev {
          color: #991b1b !important;
          background: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
        .product-swiper .swiper-button-next:after,
        .product-swiper .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .product-swiper .swiper-pagination-bullet-active {
          background: #991b1b !important;
        }
      `}</style>
    </section>
  );
}
