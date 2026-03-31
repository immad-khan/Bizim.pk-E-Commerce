'use client'

import { useState, useEffect } from 'react'
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
  const [mainImage, setMainImage] = useState(product?.image)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && product) {
      setMainImage(product.image)
      setSelectedColor(null)
      setQuantity(1)
    }
  }, [isOpen, product])

  if (!isOpen || !product) return null

  const displayBadge = product.badge || (product.onSale ? 'SALE' : undefined)
  const currentPrice = product.onSale && product.saleDiscount ? product.saleDiscount : product.price
  const displayOriginalPrice = product.onSale && product.saleDiscount ? product.price : product.originalPrice
  const stockLimit = product.quantity !== undefined ? product.quantity : 99 // Default high limit if not specified

  // Parse colors
  let colors: any[] = []
  try {
    if (product.availableColors) {
      colors = JSON.parse(product.availableColors)
      if (!Array.isArray(colors)) colors = []
    }
  } catch (e) {
    colors = []
  }

  // Collect all images
  const allImages = [
    product.image,
    product.image2,
    product.image3,
    product.image4,
    ...colors.map(c => c.imageUrl)
  ].filter(Boolean)

  // Remove duplicates
  const uniqueImages = Array.from(new Set(allImages))

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('bizim-cart') || '[]')

    const cartItemName = selectedColor ? `${product.name} (${selectedColor})` : product.name

    // Check if product already exists in cart
    const existingItem = cart.find((item: any) => item.name === cartItemName)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: `${Date.now()}-${Math.random()}`,
        name: cartItemName,
        price: currentPrice,
        image: mainImage,
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
          <div className="grid md:grid-cols-12 gap-8">
            {/* Product Images Section */}
            <div className="md:col-span-6 flex gap-4 h-full">
              {/* Vertical Thumbnails */}
              {uniqueImages.length > 1 && (
                <div className="flex flex-col gap-3 w-16 md:w-20 overflow-y-auto max-h-[400px] hide-scrollbar py-1">
                  {uniqueImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setMainImage(img as string)}
                      className={`relative w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden border-2 flex-shrink-0 transition-all ${mainImage === img ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-muted-foreground'
                        }`}
                    >
                      <img
                        src={img as string}
                        alt={`${product.name} - view ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="flex-1 rounded-lg overflow-hidden bg-secondary relative max-h-[500px]">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-opacity duration-300"
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
            <div className="md:col-span-6 space-y-6">
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

              {/* Color Options */}
              {colors.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Color Options</h3>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((c, i) => (
                      <div key={i} className="flex flex-col items-center gap-1">
                        <button
                          title={c.color}
                          onClick={() => {
                            setSelectedColor(c.color)
                            if (c.imageUrl) setMainImage(c.imageUrl)
                          }}
                          className={`w-10 h-10 rounded-full border-2 overflow-hidden flex items-center justify-center transition-all
                            ${selectedColor === c.color 
                              ? 'border-primary ring-2 ring-primary/30 outline-none scale-110' 
                              : 'border-border hover:border-muted-foreground'
                            }`}
                        >
                          {c.imageUrl ? (
                            <img src={c.imageUrl} alt={c.color} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-xs font-bold w-full h-full bg-secondary flex items-center justify-center">
                              {c.color.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </button>
                        <span className={`text-[10px] ${selectedColor === c.color ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                          {c.color}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
