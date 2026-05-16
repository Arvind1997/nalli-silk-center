import React from 'react';

const collections = [
  {
    title: 'Kanchipuram Silk',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '#kanchipuram'
  },
  {
    title: 'Banarasi Brocade',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '#banarasi'
  },
  {
    title: 'Soft Silk',
    image: 'https://images.unsplash.com/photo-1589465885857-44edb59bbff2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '#soft-silk'
  },
  {
    title: 'Bridal Trousseau',
    image: 'https://images.unsplash.com/photo-1601633519827-0ec048c4146a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    link: '#bridal'
  }
];

export default function FeaturedCollections() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Shop by Category</h2>
          <div className="w-16 h-1 bg-red-700 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {collections.map((collection, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg aspect-[3/4] mb-4">
                <img
                  src={collection.image}
                  alt={collection.title}
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white text-gray-900 px-6 py-2 uppercase tracking-wider text-sm font-semibold">
                    Explore
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-serif text-center text-gray-900 group-hover:text-red-700 transition-colors">
                {collection.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
