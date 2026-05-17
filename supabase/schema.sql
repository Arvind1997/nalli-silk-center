-- Supabase Database Schema for Nalli Silk Center

-- 1. Users Table (Extends Supabase Auth)
-- Note: Supabase already has an auth.users table. We create a public profile table 
-- that links to auth.users for app-specific data like addresses.
CREATE TABLE public.user_profiles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    shipping_address TEXT,
    phone_number TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read and update their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);


-- 2. Products Table
CREATE TABLE public.products (
    product_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- e.g., Kanchipuram, Banarasi
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER DEFAULT 1 NOT NULL,
    cloudinary_image_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Products are public to read, but only admins (if defined) can insert/update. 
-- For now, we allow public read access.
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);


-- 3. Cart Items Table
-- Note: Often carts are managed in local storage/cookies for unauthenticated users, 
-- but a DB table is great for persistent carts across devices.
CREATE TABLE public.cart_items (
    cart_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(user_id) ON DELETE CASCADE, -- Nullable for guest carts
    product_id UUID REFERENCES public.products(product_id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart items" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart items" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart items" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);


-- 4. Orders Table
CREATE TABLE public.orders (
    order_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.user_profiles(user_id) ON DELETE SET NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'Pending' NOT NULL, -- Pending, Successful, Failed
    shipping_status TEXT DEFAULT 'Processing' NOT NULL, -- Processing, Shipped, Delivered
    razorpay_order_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
-- Insert/Update is typically handled by a secure backend API/Webhook after payment, 
-- but allowing users to create pending orders is common.
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Trigger to automatically create a profile when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
