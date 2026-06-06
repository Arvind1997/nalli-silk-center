import React from 'react';
import Hero from '../components/Hero';
import FeaturedCollections from '../components/FeaturedCollections';
import ProductGrid from '../components/ProductGrid';
import PromoSection from '../components/PromoSection';

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      
      {/* Summer Sale Promo Section */}
      <PromoSection />
      
      {/* Silk Sarees Section */}
      <ProductGrid 
        title="Exquisite Silk Sarees" 
        category="Saree 1" 
        limit={8} 
      />
      
      {/* Wall Sarees Section */}
      <ProductGrid 
        title="Decorative Wall Sarees" 
        category="Wall Saree" 
        limit={8} 
      />
    </>
  );
}
