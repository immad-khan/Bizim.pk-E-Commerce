'use client'

import { useState, useEffect } from 'react'
import CartItem from '@/components/cart-item'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import ModernButton from '@/components/modern-button'
import { ShoppingBag, ArrowLeft } from 'lucide-react'

const BAG_IMAGE = 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048'

export default function CartPage() {
  const [cart, setCart] = useState<Array<{ id: string, name: string, price: number, image: string, quantity: number, shipmentFee?: number, taxEnabled?: boolean, taxRate?: number }>>([])

  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('bizim-cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
    setIsLoading(false)
  }, [])

  // Save cart to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('bizim-cart', JSON.stringify(cart))
    }
  }, [cart, isLoading])

  const handleQuantityChange = (id: string, quantity: number) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    ))
  }

  const handleRemoveItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  // Calculate shipping based on products in cart
  const maxProductShipping = cart.length > 0 
    ? Math.max(...cart.map(item => item.shipmentFee !== undefined ? item.shipmentFee : 500))
    : 500
  const shipping = subtotal > 5000 ? 0 : maxProductShipping
  
  const tax = cart.reduce((sum, item) => {
    if (!item.taxEnabled) return sum
    const rate = item.taxRate ?? 0
    return sum + (item.price * item.quantity * rate) / 100
  }, 0)
  const hasTax = cart.some(item => item.taxEnabled)
  const total = subtotal + shipping + tax

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center pt-28">
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen pt-28 md:pt-32 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors text-sm font-semibold">
              <ArrowLeft className="w-4 h-4" /> Back to Shopping
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-8">Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="bg-[#121214] border border-zinc-800/80 rounded-3xl p-8 md:p-16 max-w-xl mx-auto my-6 text-center shadow-2xl backdrop-blur-md">
              <div className="w-20 h-20 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-500/20 shadow-inner">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-3">Your cart is empty</h2>
              <p className="text-zinc-400 text-sm md:text-base mb-8 max-w-md mx-auto leading-relaxed">
                Looks like you haven&apos;t added any luxury items to your cart yet. Explore our curated collections to find your perfect match.
              </p>
              <Link href="/" className="inline-block">
                <ModernButton>Continue Shopping</ModernButton>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg p-6 border border-border/50">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price={item.price}
                      image={item.image}
                      quantity={item.quantity}
                      onQuantityChange={(qty) => handleQuantityChange(item.id, qty)}
                      onRemove={() => handleRemoveItem(item.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg p-6 sticky top-28 border border-border/50">
                  <h2 className="text-xl font-heading font-bold text-foreground mb-6">Order Summary</h2>

                  <div className="space-y-4 mb-6 border-b border-border pb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground font-bold">Rs {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground font-bold">
                        {shipping === 0 ? (
                          <span className="text-orange-500 font-bold">Free</span>
                        ) : (
                          `Rs ${shipping.toLocaleString()}`
                        )}
                      </span>
                    </div>
                    {hasTax && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tax</span>
                        <span className="text-foreground font-bold">Rs {tax.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between mb-6">
                    <span className="text-lg font-heading font-bold text-foreground">Total</span>
                    <span className="text-2xl font-heading font-bold text-orange-500">Rs {total.toLocaleString()}</span>
                  </div>

                  <div className="mb-3">
                    <ModernButton onClick={() => { window.location.href = '/checkout' }} className="w-full">
                      Proceed to Checkout
                    </ModernButton>
                  </div>

                  <Link href="/" className="w-full block">
                    <ModernButton variant="secondary" className="w-full">Continue Shopping</ModernButton>
                  </Link>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Cash on Delivery available at checkout
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
