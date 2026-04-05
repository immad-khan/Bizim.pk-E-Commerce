'use client'

import Image from 'next/image'
import { Heart } from 'lucide-react'
import { useState } from 'react'

interface ProductCardProps {
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  image?: string
  badge?: string
  badgeColor?: 'orange' | 'red'
  onSale?: boolean
  saleDiscount?: number
  quantity?: number
  onClick?: () => void
}

export default function ProductCard({
  name,
  price,
  originalPrice,
  rating,
  reviews,
  badge,
  badgeColor = 'orange',
  image,
  onSale,
  saleDiscount,
  quantity,
  onClick
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  // Use the provided badge or create one if it's on sale
  const displayBadge = badge || (onSale ? 'SALE' : undefined)
  const badgeBgColor = badgeColor === 'red' ? 'bg-red-600' : 'bg-orange-600'

  // Calculate final price. If onSale and saleDiscount exists, that's the current price. 
  // We'll treat the passed 'price' as the original price in that case, or 'originalPrice' if passed.
  const currentPrice = onSale && saleDiscount ? saleDiscount : price
  const displayOriginalPrice = onSale && saleDiscount ? price : originalPrice

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer"
    >
      {/* Image Container Only */}
      <div className="relative h-40 sm:h-80 bg-secondary overflow-hidden rounded-lg hover:shadow-lg transition duration-300">
        {displayBadge && (
          <div className={`absolute top-2 right-2 sm:top-4 sm:right-4 ${badgeBgColor} text-white px-1.5 sm:px-3 py-0.5 sm:py-1 rounded text-[9px] sm:text-xs font-bold z-20`}>
            {displayBadge}
          </div>
        )}

        {/* Quantity Badge */}
        {quantity !== undefined && (
          <div className={`absolute top-2 left-2 sm:top-4 sm:left-4 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[8px] sm:text-[10px] font-bold z-20 shadow-sm ${quantity > 0 ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
            }`}>
            {quantity > 0 ? `${quantity} in stock` : 'Out of Stock'}
          </div>
        )}

        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
            <div className="text-6xl text-gray-500">👜</div>
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsFavorite(!isFavorite)
          }}
          className="absolute bottom-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full transition opacity-0 group-hover:opacity-100 z-20"
        >
          <Heart
            className={`w-5 h-5 transition ${isFavorite ? 'fill-accent text-accent' : 'text-white'
              }`}
          />
        </button>
      </div>

      {/* Content Below Card */}
      <div className="pt-4 space-y-2">
        <h3 className="text-[10px] sm:text-sm font-heading font-bold text-foreground text-center line-clamp-2">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-center gap-2">
          <span className={`text-sm sm:text-lg font-heading font-bold ${onSale ? 'text-red-500' : 'text-accent'}`}>
            Rs {currentPrice.toLocaleString()}
          </span>
          {displayOriginalPrice && (
            <span className="text-[10px] sm:text-sm text-muted-foreground line-through">
              Rs {displayOriginalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-xs ${i < Math.floor(rating) ? 'text-accent' : 'text-gray-600'
                  }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-xs font-bold text-foreground">({reviews})</span>
        </div>
      </div>
    </div>
  )
}
