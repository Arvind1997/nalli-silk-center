'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../lib/supabase';
import Link from 'next/link';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductGrid({ title, category, limit = 8 }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient();
        if (!supabase) return;

        let query = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query.limit(limit);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error(`Error fetching ${category} products:`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category, limit]);

  if (loading || products.length === 0) return null;

  return (
    <section className="relative z-10 py-16 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2 uppercase tracking-wider">
              {title}
            </h2>
            <div className="w-16 h-1 bg-red-800"></div>
          </div>
          <Link 
            href={`/category/${category || 'all'}`} 
            className="flex items-center text-red-800 font-bold text-sm uppercase tracking-widest hover:text-red-900 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <div key={product.product_id} className="group flex flex-col h-full">
              <Link 
                href={`/product/${product.product_id}`} 
                className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-4 block"
              >
                <img
                  src={product.cloudinary_image_url}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <div className="flex-grow flex flex-col">
                <Link href={`/product/${product.product_id}`}>
                  <h3 className="text-sm md:text-base font-serif font-bold text-gray-900 group-hover:text-red-800 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <p className="text-lg font-medium text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </p>
                  <button 
                    onClick={() => addToCart({
                      id: product.product_id,
                      name: product.name,
                      price: product.price,
                      image: product.cloudinary_image_url,
                      category: product.category
                    })}
                    className="p-2 rounded-full border border-gray-200 text-gray-900 hover:bg-red-800 hover:text-white hover:border-red-800 transition-all duration-300"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
