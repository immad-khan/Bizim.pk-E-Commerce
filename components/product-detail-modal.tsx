'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  const [activeTab, setActiveTab] = useState<'gallery' | 'description' | 'information'>('gallery')

  useEffect(() => {
    if (isOpen && product) {
      setMainImage(product.image)
      setSelectedColor(null)
      setQuantity(1)
      setActiveTab('gallery')
    }
  }, [isOpen, product])

  if (!isOpen || !product) return null

  const displayBadge = product.badge || (product.onSale ? 'SALE' : undefined)
  const currentPrice = product.onSale && product.saleDiscount ? product.saleDiscount : product.price
  const displayOriginalPrice = product.onSale && product.saleDiscount ? product.price : product.originalPrice || 0
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
    ...colors.map((c: any) => c.imageUrl)
  ].filter(Boolean)

  // Remove duplicates
  const uniqueImages = Array.from(new Set(allImages))

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('bizim-cart') || '[]')
    const cartItemName = selectedColor ? `${product.name} (${selectedColor})` : product.name

    const existingItem = cart.find((item: any) => item.name === cartItemName)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({
        id: `${Date.now()}-${Math.random()}`,
        name: cartItemName,
        price: currentPrice,
        image: mainImage,
        quantity: quantity,
        shipmentFee: product.shipmentFee || 0
      })
    }

    localStorage.setItem('bizim-cart', JSON.stringify(cart))
    setAddedToCart(true)

    setTimeout(() => {
      onClose()
      setAddedToCart(false)
      router.push('/cart')
    }, 1200)
  }
  
  // Custom Color Map for solid CSS color rendering
  const getColorHex = (colorName: string) => {
    const map: Record<string, string> = {
      'brown': '#8B4513', 'navy': '#1A2341', 'blue': '#2D4A77', 
      'black': '#111111', 'white': '#F8F9FA', 'grey': '#808080', 'gray': '#808080',
      'red': '#8B1C1C', 'green': '#3A5335', 'purple': '#4A3353',
      'mustard': '#CD9B55', 'olive': '#7B8144'
    }
    const clean = colorName.toLowerCase().trim()
    for (const key in map) {
      if (clean.includes(key)) return map[key]
    }
    return '#A2A2A2' // Default grey
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 lg:p-8 backdrop-blur-md transition-all overflow-y-auto">
      {/* Container forcing a Dark Theme Aesthetic - Wider and less tall to look zoomed out */}
      <div className="bg-[#0a0a0a] text-zinc-100 rounded-lg max-w-[1200px] w-full relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-zinc-800/50 my-auto flex flex-col mt-[10vh] md:mt-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-zinc-400 hover:text-orange-500 transition-colors text-2xl font-light w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-900 bg-black/50 shadow-sm md:shadow-none md:bg-transparent"
        >
          &times;
        </button>

        <div className="grid md:grid-cols-12 md:max-h-[80vh]">
          {/* Left Box: Product Images Section */}
          <div className="md:col-span-7 flex flex-col md:flex-row bg-[#111111] p-4 lg:p-8 gap-2 md:gap-6 border-r border-zinc-800/50 rounded-l-lg">
            {/* Vertical Thumbnails */}
            {uniqueImages.length > 1 && (
              <div className="flex justify-center md:justify-start md:flex-col gap-[2px] md:gap-2 overflow-x-auto md:overflow-y-auto md:h-[400px] hide-scrollbar pb-2 md:pb-0 w-full md:w-16 shrink-0 order-2 md:order-1 pt-0 md:pt-0">
                {uniqueImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(img as string)}
                    className={`relative w-14 h-14 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-md bg-[#1a1a1a] flex-shrink-0 transition-all ${
                      mainImage === img 
                      ? 'border-2 border-orange-500 shadow-md ring-2 ring-[#0a0a0a]' 
                      : 'border border-zinc-800 hover:border-zinc-600 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img as string}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Main Image */}
            <div className="flex-1 overflow-hidden relative flex items-center justify-center order-1 md:order-2 bg-[#111111] rounded-lg">
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-auto max-h-[350px] lg:max-h-[400px] object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105"
              />
              {displayBadge && (
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-sm text-[10px] font-bold tracking-widest text-white ${
                  displayBadge === 'SALE' ? 'bg-orange-600' : 'bg-red-800'
                }`}>
                  {displayBadge}
                </div>
              )}
            </div>
          </div>

          {/* Right Box: Product Details Container */}
          <div className="md:col-span-5 flex flex-col p-4 lg:p-8 bg-[#0a0a0a] rounded-r-lg">
            
            {/* Minimalist Tabs Selection */}
            <div className="flex w-full mb-6 border-b border-zinc-800">
              {(['gallery', 'description', 'information'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 pb-3 text-[10px] lg:text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors ${
                    activeTab === tab 
                      ? 'text-orange-500 border-b-2 border-orange-500' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Scrollable Tab Content Area */}
            <div className="flex-1 overflow-y-auto hide-scrollbar">
              
              {/* Product Title Section */}
              <div className="mb-4 md:mb-6">
                <div className="text-zinc-500 text-[9px] font-sans tracking-widest mb-1.5 flex justify-between uppercase">
                  <span>BIZIM BAGS</span>
                  <div className="flex items-center gap-1 text-orange-500">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="font-bold text-zinc-300 text-[10px]">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
                  </div>
                </div>
                <h1 className="text-xl md:text-2xl font-sans text-white mb-1.5 leading-snug">
                  {product.name.replace(/_o/g, '')}
                </h1>
              </div>

              {/* Dynamic Content Based on Tab Options */}
              {activeTab === 'gallery' && (
                <div className="space-y-5 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  
                  {/* Chic Solid Color Swatches */}
                  {colors.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[9px] tracking-widest uppercase font-semibold text-zinc-400">
                        <span>Color Options</span>
                        {selectedColor && <span className="text-white font-bold">{selectedColor}</span>}
                      </div>
                      <div className="flex flex-wrap gap-3 pt-0.5">
                        {colors.map((c: any, i: number) => {
                          const isSelected = selectedColor === c.color;
                          const hex = getColorHex(c.color);
                          const isDark = hex === '#111111' || hex === '#000000' || hex === '#1A2341';
                          return (
                            <button
                              key={i}
                              onClick={() => {
                                setSelectedColor(c.color)
                                if (c.imageUrl) setMainImage(c.imageUrl)
                              }}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-all shadow-sm ${
                                isDark ? 'border border-zinc-600' : 'border border-transparent'
                              } ${
                                isSelected 
                                  ? 'ring-2 ring-offset-2 ring-offset-[#0a0a0a] ring-orange-500 scale-110' 
                                  : 'hover:scale-110'
                              }`}
                              style={{ backgroundColor: hex }}
                              title={c.color}
                            >
                              {isSelected && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={hex === '#FFFFFF' || hex === '#F8F9FA' ? '#000' : '#FFF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Clean Quantity & Pricing Table Design */}
                  <div className="space-y-0 text-sm">
                    <div className="flex justify-between items-end border-b border-zinc-800 pb-1.5 mb-1.5">
                      <h3 className="text-[9px] font-semibold text-zinc-500 uppercase tracking-[0.1em]">Sizes</h3>
                      <h3 className="text-[9px] font-semibold text-zinc-500 uppercase tracking-[0.1em]">Item Price & Qty</h3>
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-zinc-800/50">
                      <div>
                        <span className="text-zinc-200 text-xs font-medium">Standard</span>
                        <div className="text-[8px] text-zinc-500 font-mono mt-0.5">SKU: {product.id.toString().slice(0,8).padStart(8,'0')}</div>
                      </div>
                      
                      <div className="flex items-center gap-2 md:gap-4">
                        {/* Custom Counter Input */}
                        <div className="flex items-center border border-zinc-700 rounded-sm bg-[#111111] h-7">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-6 h-full flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-30"
                            disabled={stockLimit === 0}
                          >
                            &minus;
                          </button>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.min(stockLimit, Math.max(1, parseInt(e.target.value) || 1)))}
                            className="w-6 text-center bg-transparent text-xs font-semibold text-white focus:outline-none hide-arrows py-0"
                            disabled={stockLimit === 0}
                          />
                          <button
                            onClick={() => setQuantity(Math.min(stockLimit, quantity + 1))}
                            className="w-6 h-full flex items-center justify-center text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors disabled:opacity-30"
                            disabled={stockLimit === 0 || quantity >= stockLimit}
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-right w-[65px] md:w-[75px]">
                          <span className="text-[13px] md:text-[15px] font-bold text-white whitespace-nowrap">
                            Rs {currentPrice.toLocaleString()}
                          </span>
                          {displayOriginalPrice > 0 && currentPrice !== displayOriginalPrice && (
                            <div className="text-[9px] text-zinc-500 line-through mt-0.5">
                              Rs {displayOriginalPrice.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total Calculations */}
                  <div className="flex justify-between items-end pt-1 pb-1">
                    <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Total</h3>
                    <span className="text-xl md:text-2xl font-heading text-orange-500 font-normal">
                       Rs {(currentPrice * quantity).toLocaleString()}
                    </span>
                  </div>

                </div>
              )}

              {activeTab === 'description' && (
                <div className="space-y-4 text-zinc-400 text-[13px] leading-relaxed animate-in fade-in slide-in-from-right-4 duration-300 pt-2">
                  <p className="text-[15px] text-white font-medium">Elevate Your Everyday Standard.</p>
                  <p>
                    {product.description || "Premium luxury bag crafted with the finest materials. This exclusive piece features sophisticated design elements and superior craftsmanship, perfect for those who appreciate quality and elegance in their daily ventures."}
                    </p>
                  <ul className="space-y-3 text-zinc-300 mt-6 border-t border-zinc-800 pt-4">
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 border border-orange-500"></span> 
                      Premium material construction & durability
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 border border-orange-500"></span> 
                      Multi-layer protective sealing
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 border border-orange-500"></span> 
                      Limited edition signature series collection
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'information' && (
                <div className="space-y-4 text-zinc-300 text-[13px] animate-in fade-in slide-in-from-right-4 duration-300 pt-2">
                  <div className="flex justify-between py-3 border-b border-zinc-800">
                    <span className="font-semibold text-white uppercase text-[10px] tracking-widest">Availability</span>
                    <span className="text-right text-zinc-400">{stockLimit > 0 ? `${stockLimit} units in warehouse` : 'Out of stock'}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-zinc-800">
                    <span className="font-semibold text-white uppercase text-[10px] tracking-widest">Delivery Time</span>
                    <span className="text-right text-zinc-400">2 - 5 Business Days Delivery</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-zinc-800">
                    <span className="font-semibold text-white uppercase text-[10px] tracking-widest">Return Policy</span>
                    <span className="text-right text-zinc-400">30-day money back guarantee</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-zinc-800">
                    <span className="font-semibold text-white uppercase text-[10px] tracking-widest">Authenticity</span>
                    <span className="text-right text-zinc-400">100% Genuine Certified</span>
                  </div>
                </div>
              )}

            </div>

            {/* Block Add To Cart Button */}
            <div className="mt-8 pt-4 border-t border-zinc-800">
              <button
                onClick={handleAddToCart}
                disabled={addedToCart || stockLimit === 0}
                className={`w-full py-3 px-8 font-bold rounded-2xl transition duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-3 relative overflow-hidden group text-white ${
                  addedToCart 
                    ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 focus:ring-emerald-500' 
                    : 'bg-gradient-to-b from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800'
                } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg`}
              >
                <span className={`transition-all duration-300 ${addedToCart ? '-translate-y-10 opacity-0' : 'translate-y-0 opacity-100'}`}>
                  {stockLimit === 0 ? 'NOT AVAILABLE' : 'Add to Cart'}
                </span>
                
                <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ${addedToCart ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  ADDED
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
      {/* Inline styles for hiding number input arrows */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-arrows::-webkit-outer-spin-button,
        .hide-arrows::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .hide-arrows {
          -moz-appearance: textfield;
        }
      `}} />
    </div>
  )
}
