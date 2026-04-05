'use client'

import Image from 'next/image'
import ModernButton from './modern-button'

export default function HeroGrid() {
  return (
    <section className="bg-background py-4 md:py-0 mb-6 sm:mb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-h-[500px] sm:min-h-[600px]">
          {/* Large Left Panel */}
          <div className="relative rounded-xl overflow-hidden group md:row-span-2 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col justify-end p-8 sm:p-8 min-h-[450px] sm:min-h-auto shadow-xl">
            {/* Background image with overlay */}
            <Image
              src="https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048"
              alt="Limited Edition Bags"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Free Mystery Gift Badge */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-1 sm:gap-2 bg-black/50 backdrop-blur-sm border border-accent/40 rounded-full px-3 py-1.5 sm:px-4 sm:py-2">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent rounded-full animate-pulse"></div>
              <span className="text-[10px] sm:text-xs font-semibold text-accent">FREE MYSTERY GIFT</span>
            </div>

            <div className="relative z-10 space-y-2 sm:space-y-4">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                Limited Edition Bags
              </div>
              <p className="text-sm text-gray-300">Discover our exclusive collection</p>
              <ModernButton className="text-xs sm:text-sm px-6 py-2 sm:px-6 sm:py-3 w-fit">Shop Now</ModernButton>
            </div>
          </div>

          {/* Right Column - Top Panel */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-amber-900 to-yellow-900 flex flex-col justify-end p-6 sm:p-6 min-h-[220px] sm:min-h-[240px] shadow-lg group">
            <Image
              src="https://i.pinimg.com/webp/1200x/7a/c4/45/7ac445a42df2b1fafd6fef58b895c983.webp"
              alt="Curated Global Bags"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="relative z-10 space-y-3">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                Curated Global Bags
              </div>
              <ModernButton className="text-xs sm:text-sm py-2 px-4 sm:py-2 sm:px-4 w-fit">Shop Collection</ModernButton>
            </div>
          </div>

          {/* Right Column - Middle Left Panel */}
          <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-red-900 to-orange-900 flex flex-col justify-end p-6 sm:p-6 min-h-[160px] sm:min-h-auto shadow-lg group">
            <Image
              src="https://i.pinimg.com/1200x/82/6e/80/826e8083a923ebc39e8ce2d65a206f6d.jpg"
              alt="Save Up To 20%"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative z-10 space-y-2">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                Save Up To 20%
              </div>
              <p className="text-sm text-gray-200">Season Sale</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
