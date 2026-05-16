import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1583391733958-d25e07fac66a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    tagline: 'Timeless Elegance Since 1928',
    title: 'The Legacy of \n Pure Silk',
    description: 'Discover our exquisite collection of handwoven Kanchipuram and Banarasi sarees.',
    primaryBtn: 'Shop Bridal',
    secondaryBtn: 'View Collections'
  },
  {
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    tagline: 'Crafted with Passion',
    title: 'Artistry in \n Every Thread',
    description: 'Each drape tells a story of heritage, skill, and centuries-old traditions.',
    primaryBtn: 'Shop Kanchipuram',
    secondaryBtn: 'Our Heritage'
  },
  {
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    tagline: 'Modern Elegance',
    title: 'Traditional Soul \n Modern Grace',
    description: 'Explore our latest arrivals featuring contemporary designs on pure silk.',
    primaryBtn: 'Shop New Arrivals',
    secondaryBtn: 'Trendsetter'
  }
];

export default function Hero() {
  return (
    <section className="h-[80vh] min-h-[600px] w-full overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className="h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full flex items-center justify-center">
              {/* Background Image Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                  backgroundImage: `url('${slide.image}')`
                }}
              >
                <div className="absolute inset-0 bg-black/40"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
                <span className="block text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-gray-200">
                  {slide.tagline}
                </span>
                <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 leading-tight whitespace-pre-line">
                  {slide.title}
                </h2>
                <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
                  {slide.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white px-8 py-4 uppercase tracking-widest text-sm font-semibold transition-colors">
                    {slide.primaryBtn}
                  </button>
                  <button className="w-full sm:w-auto bg-transparent border border-white hover:bg-white hover:text-black text-white px-8 py-4 uppercase tracking-widest text-sm font-semibold transition-colors">
                    {slide.secondaryBtn}
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        .swiper-button-next, .swiper-button-prev {
          color: white !important;
          transform: scale(0.6);
        }
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: #b91c1c !important; /* red-700 */
        }
      `}</style>
    </section>
  );
}
