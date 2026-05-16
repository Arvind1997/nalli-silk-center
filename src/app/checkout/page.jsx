'use client';

import React from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function Checkout() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const shipping = cartTotal > 50000 ? 0 : 500;
  const total = cartTotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Looks like you haven't added any silks yet.</p>
        <Link 
          href="/"
          className="bg-red-800 text-white px-8 py-3 rounded-md hover:bg-red-900 transition-colors uppercase tracking-widest font-medium"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 uppercase tracking-wider">Your Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
                <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-serif font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-gray-500 uppercase tracking-wider">{item.category}</p>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border rounded-md">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-1 font-medium">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-bold text-red-800">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary & Shipping */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 uppercase tracking-wide">Shipping Details</h2>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" />
                  <input type="text" placeholder="Last Name" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" />
                </div>
                <input type="text" placeholder="Complete Address" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="City" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" />
                  <input type="text" placeholder="PIN Code" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" />
                </div>
              </form>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <h2 className="text-xl font-bold mb-4 border-b pb-2 uppercase tracking-wide">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-gray-400 italic">Free shipping on orders above ₹50,000</p>
                )}
                <div className="flex justify-between font-bold text-xl border-t pt-3 text-red-800">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <button className="w-full bg-red-800 text-white py-4 rounded-md hover:bg-red-900 transition-colors uppercase tracking-widest font-bold shadow-lg">
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
