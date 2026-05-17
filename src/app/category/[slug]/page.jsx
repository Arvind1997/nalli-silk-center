'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase';
import Link from 'next/link';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import { useCart } from '../../../context/CartContext';
import { useParams } from 'next/navigation';

export default function CategoryPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        const supabase = createClient();
        if (!supabase) return;

        // Decode the slug to get the actual category name
        const decodedCategory = decodeURIComponent(slug);
        setCategoryName(decodedCategory === 'all' ? 'All Collections' : decodedCategory);

        let query = supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (decodedCategory !== 'all') {
          query = query.eq('category', decodedCategory);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error(`Error fetching products for category ${slug}:`, error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-500 font-light tracking-widest animate-pulse">
          LOADING {categoryName.toUpperCase()}...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs / Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center text-gray-500 hover:text-red-800 transition-colors mb-8 text-sm uppercase tracking-widest font-medium"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 uppercase tracking-[0.2em]">
            {categoryName}
          </h1>
          <div className="w-20 h-1 bg-red-800 mb-6"></div>
          <p className="text-gray-600 font-light">
            Showing {products.length} exquisite pieces.
          </p>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <p className="text-gray-500 italic">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <div key={product.product_id} className="group flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <Link 
                  href={`/product/${product.product_id}`} 
                  className="relative aspect-[3/4] overflow-hidden block"
                >
                  <img
                    src={product.cloudinary_image_url}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
                
                <div className="p-4 flex-grow flex flex-col">
                  <span className="text-[10px] text-red-800 font-bold uppercase tracking-widest mb-1">
                    {product.category}
                  </span>
                  <Link href={`/product/${product.product_id}`}>
                    <h3 className="text-sm font-serif font-bold text-gray-900 group-hover:text-red-800 transition-colors line-clamp-2 mb-2 h-10">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                    <p className="text-base font-bold text-gray-900">
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
                      className="p-2 rounded-full bg-gray-50 text-gray-900 hover:bg-red-800 hover:text-white transition-all duration-300"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
