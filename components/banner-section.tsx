'use client'

import ModernButton from './modern-button'
import Link from 'next/link'
import Image from 'next/image'

export default function BannerSection() {
  return (
    <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-16 md:py-24 border-t border-border relative overflow-hidden">
      {/* Background image with overlay */}
      <Image 
        src="https://png.pngtree.com/thumb_back/fh260/background/20240529/pngtree-backpack-on-school-table-generate-ai-image_15734230.jpg"
        alt="World Branded Bag Collections"
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-6">
          <div className="inline-block">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">Premium Collection</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            World Branded Bag Collections
          </h2>

          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Curated from the world's most prestigious bag designers. Elevate your style with our exclusive limited-edition selections.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link href="/collections">
              <ModernButton>Explore Collection</ModernButton>
            </Link>
            <Link href="/about">
              <ModernButton variant="secondary">Learn More</ModernButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
