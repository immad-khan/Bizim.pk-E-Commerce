'use client'

import Image from 'next/image'
import ModernButton from './modern-button'

export default function HeroGrid() {
  return (
    <section className="bg-background py-8 md:py-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[500px]">
          {/* Large Left Panel */}
          <div className="relative rounded-lg overflow-hidden group md:row-span-2 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col justify-end p-8">
            {/* Background image with overlay */}
            <img 
              src="https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048"
              alt="Limited Edition Bags"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Free Mystery Gift Badge */}
            <div className="absolute top-6 right-6 z-20 flex items-center gap-2 bg-black/50 backdrop-blur-sm border border-accent/40 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-accent">FREE MYSTERY GIFT</span>
            </div>

            <div className="relative z-10 space-y-4">
              <div className="text-4xl md:text-5xl font-bold text-white leading-tight">
                Limited Edition Bags
              </div>
              <p className="text-sm text-gray-300">Discover our exclusive collection</p>
              <ModernButton>Shop Now</ModernButton>
            </div>
          </div>

          {/* Right Column - Top Panel */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-900 to-yellow-900 flex flex-col justify-end p-6 md:min-h-[240px]">
            <img 
              src="https://i.pinimg.com/736x/46/64/dd/4664ddc1381be6f67999e012ec440e80.jpg"
              alt="Curated Global Bags"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 space-y-3">
              <div className="text-2xl md:text-3xl font-bold text-white">
                Curated Global Bags
              </div>
              <ModernButton className="py-2 px-4 text-sm">Shop Collection</ModernButton>
            </div>
          </div>

          {/* Right Column - Middle Left Panel */}
          <div className="relative overflow-hidden bg-gradient-to-br from-red-900 to-orange-900 flex flex-col justify-end p-6">
            <img 
              src="https://i.pinimg.com/1200x/1c/b0/f0/1cb0f0b9fb842496225dd9132499edd8.jpg"
              alt="Save Up To 20%"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 space-y-2">
              <div className="text-2xl md:text-3xl font-bold text-white">
                Save Up To 20%
              </div>
              <p className="text-xs text-gray-200">Season Sale</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
