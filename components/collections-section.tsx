'use client'

import ModernButton from './modern-button'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

const BAG_IMAGE = 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048'

export default function CollectionsSection() {
  const [customizations, setCustomizations] = useState<any>(null);

  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5264';
        const res = await fetch(`${API_BASE_URL}/api/Customizations`);
        if (res.ok) {
          const data = await res.json();
          setCustomizations(data);
        }
      } catch (err) {
        console.error('Error fetching customizations:', err);
      }
    };
    fetchCustomizations();
  }, []);

  const collections = [
    {
      name: 'WOMEN\'S COLLECTION',
      image: customizations?.collectionImage1 || BAG_IMAGE,
      href: '/collections?collection=womens'
    },
    {
      name: 'SMART BAGS',
      image: customizations?.collectionImage2 || BAG_IMAGE,
      href: '/collections?collection=smart-bags'
    },
    {
      name: 'MEN\'S COLLECTION',
      image: customizations?.collectionImage3 || BAG_IMAGE,
      href: '/collections?collection=mens'
    }
  ]

  return (
    <section className="bg-background py-16 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            Shop By Collection
          </h2>
          <p className="text-muted-foreground text-lg">Explore our exclusive categories</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {collections.map((collection, index) => (
            <Link
              key={index}
              href={collection.href}
              className="group relative rounded-xl overflow-hidden h-56 sm:h-72 cursor-pointer shadow-lg border border-border/50"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-colors duration-300"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 z-10 p-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-white text-center leading-tight uppercase tracking-[0.2em] drop-shadow-md">
                  {collection.name}
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <ModernButton className="py-2 px-8 text-sm font-bold">Explore</ModernButton>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
