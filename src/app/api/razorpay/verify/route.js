import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase';

export async function POST(request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderDetails 
    } = await request.json();

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return NextResponse.json({ error: "Razorpay secret key is not configured" }, { status: 500 });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", key_secret)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: orderDetails.user_id || null, // Can be null for guest checkout
          total_amount: orderDetails.total_amount,
          payment_status: 'Successful',
          shipping_status: 'Processing',
          razorpay_order_id: razorpay_order_id,
        })
        .select();

      if (error) throw error;

      return NextResponse.json({ 
        message: "Payment verified successfully", 
        orderId: data[0].order_id 
      }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Invalid signature" }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
