'use client';

import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    pinCode: '',
    email: '',
    phone: ''
  });

  const shipping = cartTotal > 50000 ? 0 : 500;
  const total = cartTotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    // Basic validation
    if (!shippingDetails.firstName || !shippingDetails.address || !shippingDetails.phone) {
      alert("Please fill in the required shipping details.");
      return;
    }

    setLoading(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // 1. Create order on server
      const orderRes = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.error || "Failed to create order");

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Nalli Silk Center",
        description: "Exquisite Handwoven Silks",
        image: "/favicon.svg",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 3. Verify payment on server
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderDetails: {
                  total_amount: total,
                  shipping_details: shippingDetails,
                  items: cartItems
                }
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              clearCart();
              alert("Payment Successful! Order ID: " + verifyData.orderId);
              router.push('/'); // Or a success page
            } else {
              alert("Payment verification failed: " + verifyData.message);
            }
          } catch (err) {
            console.error("Verification error:", err);
            alert("An error occurred during verification.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
          email: shippingDetails.email,
          contact: shippingDetails.phone,
        },
        theme: {
          color: "#991b1b", // red-800
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred during checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="firstName" value={shippingDetails.firstName} onChange={handleInputChange} placeholder="First Name *" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" required />
                  <input type="text" name="lastName" value={shippingDetails.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" />
                </div>
                <input type="text" name="address" value={shippingDetails.address} onChange={handleInputChange} placeholder="Complete Address *" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" name="city" value={shippingDetails.city} onChange={handleInputChange} placeholder="City *" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" required />
                  <input type="text" name="pinCode" value={shippingDetails.pinCode} onChange={handleInputChange} placeholder="PIN Code *" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input type="email" name="email" value={shippingDetails.email} onChange={handleInputChange} placeholder="Email" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" />
                  <input type="tel" name="phone" value={shippingDetails.phone} onChange={handleInputChange} placeholder="Phone Number *" className="w-full border p-2 rounded text-sm focus:ring-1 focus:ring-red-800 outline-none" required />
                </div>
              </div>
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
              <button 
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-red-800 text-white py-4 rounded-md hover:bg-red-900 transition-colors uppercase tracking-widest font-bold shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Purchase"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
