'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ModernButton from './modern-button'

import { Product } from '@/lib/product-context'

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

export default function ProductDetailModal({ isOpen, onClose, product }: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const [addedToCart, setAddedToCart] = useState(false)

  if (!isOpen) return null

  const displayBadge = product.badge || (product.onSale ? 'SALE' : undefined)
  const currentPrice = product.onSale && product.saleDiscount ? product.saleDiscount : product.price
  const displayOriginalPrice = product.onSale && product.saleDiscount ? product.price : product.originalPrice
  const stockLimit = product.quantity !== undefined ? product.quantity : 99 // Default high limit if not specified

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('bizim-cart') || '[]')

    // Check if product already exists in cart
    const existingItem = cart.find((item: any) => item.name === product.name)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: `${Date.now()}-${Math.random()}`,
        name: product.name,
        price: currentPrice,
        image: product.image,
        quantity: quantity
      })
    }

    localStorage.setItem('bizim-cart', JSON.stringify(cart))
    setAddedToCart(true)

    setTimeout(() => {
      onClose()
      setAddedToCart(false)
      router.push('/cart')
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="sticky top-0 bg-card border-b border-border p-4 flex justify-between items-center">
          <h2 className="text-xl font-heading font-bold text-foreground">Product Details</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {displayBadge && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded text-sm font-bold text-white ${displayBadge === 'SALE' ? 'bg-orange-600' : 'bg-red-600'
                    }`}>
                    {displayBadge}
                  </div>
                )}
                {product.quantity !== undefined && (
                  <div className={`absolute top-4 left-4 px-3 py-1 rounded text-xs font-bold shadow-md ${product.quantity > 0 ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                    {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-3">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < product.rating ? 'text-primary' : 'text-muted'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-bold text-foreground">
                  {product.rating}.0
                </span>
                <span className="text-muted-foreground text-sm">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className={`text-3xl font-bold ${product.onSale ? 'text-red-500' : 'text-primary'}`}>
                    Rs {currentPrice.toLocaleString()}
                  </span>
                  {displayOriginalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      Rs {displayOriginalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {displayOriginalPrice && currentPrice < displayOriginalPrice && (
                  <p className="text-primary text-sm font-bold">
                    Save Rs {(displayOriginalPrice - currentPrice).toLocaleString()} (
                    {Math.round(((displayOriginalPrice - currentPrice) / displayOriginalPrice) * 100)}%)
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-3 border-y border-border py-6">
                <p className="text-foreground leading-relaxed">
                  Premium luxury bag crafted with the finest materials. This exclusive piece features sophisticated design elements and superior craftsmanship, perfect for those who appreciate quality and elegance.
                </p>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>✓ Premium leather construction</li>
                  <li>✓ Limited edition availability</li>
                  <li>✓ Free mystery gift included</li>
                  <li>✓ 30-day return guarantee</li>
                </ul>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-foreground">Quantity:</span>
                  <div className="flex items-center border border-border rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-foreground hover:bg-secondary transition disabled:opacity-50"
                      disabled={stockLimit === 0}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(stockLimit, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-12 text-center bg-transparent text-foreground border-l border-r border-border py-2 disabled:opacity-50"
                      disabled={stockLimit === 0}
                    />
                    <button
                      onClick={() => setQuantity(Math.min(stockLimit, quantity + 1))}
                      className="px-4 py-2 text-foreground hover:bg-secondary transition disabled:opacity-50"
                      disabled={stockLimit === 0 || quantity >= stockLimit}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="w-full">
                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart || stockLimit === 0}
                    className="w-full disabled:opacity-50"
                  >
                    <ModernButton
                      className="w-full"
                      disabled={addedToCart || stockLimit === 0}
                    >
                      {stockLimit === 0 ? 'Out of Stock' : addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                    </ModernButton>
                  </button>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ Free shipping on orders over Rs 5000</p>
                <p>✓ Secure checkout with SSL encryption</p>
                <p>✓ 24/7 customer support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
