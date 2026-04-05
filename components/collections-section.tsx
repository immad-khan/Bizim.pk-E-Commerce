'use client'

import ModernButton from './modern-button'
import Link from 'next/link'
import Image from 'next/image'

const BAG_IMAGE = 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048'

export default function CollectionsSection() {
  const collections = [
    {
      name: 'WOMEN\'S COLLECTION',
      image: BAG_IMAGE,
      href: '/collections?filter=female'
    },
    {
      name: 'SMART BAGS',
      image: BAG_IMAGE,
      href: '/collections'
    },
    {
      name: 'MEN\'S COLLECTION',
      image: BAG_IMAGE,
      href: '/collections'
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
              className="group relative rounded-lg overflow-hidden h-48 sm:h-64 cursor-pointer shadow-md"
            >
              <Image
                src={collection.image}
                alt={collection.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-opacity duration-300 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300"></div>

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 z-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white text-center px-4 leading-tight uppercase tracking-widest">{collection.name}</h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ModernButton className="py-2 px-6 text-sm">Explore</ModernButton>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
