'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '../../../lib/supabase';
import { useCart } from '../../../context/CartContext';
import { ChevronRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const supabase = createClient();
        if (!supabase) return;

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('product_id', id)
          .single();
          
        if (error) throw error;
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-500">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
          <button 
            onClick={() => router.push('/')}
            className="text-red-800 hover:underline"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <button onClick={() => router.push('/')} className="hover:text-red-800">Home</button>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-red-800">{product.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image with Zoom */}
          <div 
            className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden shadow-lg cursor-zoom-in"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img 
              src={product.cloudinary_image_url} 
              alt={product.name} 
              className={`w-full h-full object-cover transition-transform duration-200 ease-out ${
                isZoomed ? 'scale-[2.5]' : 'scale-100'
              }`}
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
              }}
            />
            {/* Visual hint for zoom */}
            {!isZoomed && (
              <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold text-gray-900 shadow-sm pointer-events-none">
                Hover to zoom
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-red-700 font-semibold tracking-widest uppercase text-xs">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">
                {product.name}
              </h1>
              <p className="text-2xl font-medium text-gray-900 mt-4">
                ₹{product.price.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
              {product.sub_description && (
                <div className="bg-red-50/45 p-4 rounded-md border-l-4 border-red-800">
                  <h4 className="text-[11px] uppercase tracking-wider font-bold text-red-900 mb-1">
                    Weave & Appearance Details
                  </h4>
                  <p className="text-gray-700 leading-relaxed text-sm font-light">
                    {product.sub_description}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4">
              <button 
                onClick={() => addToCart({
                  id: product.product_id,
                  name: product.name,
                  price: product.price,
                  image: product.cloudinary_image_url,
                  category: product.category
                })}
                className="w-full bg-red-800 text-white py-4 rounded-md hover:bg-red-900 transition-colors uppercase tracking-widest font-bold shadow-md"
              >
                Add to Cart
              </button>
              <button className="w-full border-2 border-red-800 text-red-800 py-4 rounded-md hover:bg-red-50 transition-colors uppercase tracking-widest font-bold">
                Buy It Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100">
              <div className="flex flex-col items-center text-center space-y-2">
                <Truck className="w-6 h-6 text-gray-400" />
                <span className="text-xs uppercase font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <ShieldCheck className="w-6 h-6 text-gray-400" />
                <span className="text-xs uppercase font-medium">Authentic Silk</span>
              </div>
              <div className="flex flex-col items-center text-center space-y-2">
                <RefreshCw className="w-6 h-6 text-gray-400" />
                <span className="text-xs uppercase font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
