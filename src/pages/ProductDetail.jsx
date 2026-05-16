import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import { ChevronRight, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const product = products.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif mb-4">Product Not Found</h2>
          <button 
            onClick={() => navigate('/')}
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
          <button onClick={() => navigate('/')} className="hover:text-red-800">Home</button>
          <ChevronRight className="w-4 h-4" />
          <span className="hover:text-red-800">{product.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
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

            <p className="text-gray-600 leading-relaxed text-lg">
              {product.description}
            </p>

            <div className="space-y-4 pt-4">
              <button 
                onClick={() => addToCart(product)}
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
