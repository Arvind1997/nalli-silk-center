import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import FeaturedCollections from './components/FeaturedCollections';
import Footer from './components/Footer';
import './index.css';

function App() {
  return (
    <div className="font-sans text-gray-900 bg-white">
      <Header />
      <main>
        <Hero />
        <FeaturedCollections />
      </main>
      <Footer />
    </div>
  );
}

export default App;
