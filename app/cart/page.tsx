'use client'

import { useState, useEffect } from 'react'
import CartItem from '@/components/cart-item'
import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import ModernButton from '@/components/modern-button'

const BAG_IMAGE = 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048'

export default function CartPage() {
  const [cart, setCart] = useState<Array<{ id: string, name: string, price: number, image: string, quantity: number, shipmentFee?: number }>>([])

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
  
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <p className="text-muted-foreground">Loading cart...</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/" className="text-accent hover:text-orange-600 transition">
              ← Back to Shopping
            </Link>
          </div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-12">Shopping Cart</h1>

          {cart.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-6">Your cart is empty</p>
              <Link
                href="/"
                className="inline-block bg-accent hover:bg-orange-600 text-white font-bold py-3 px-8 rounded transition"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg p-6">
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
                <div className="bg-card rounded-lg p-6 sticky top-24">
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
                          <span className="text-accent">Free</span>
                        ) : (
                          `Rs ${shipping.toLocaleString()}`
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (10%)</span>
                      <span className="text-foreground font-bold">Rs {tax.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between mb-6">
                    <span className="text-lg font-heading font-bold text-foreground">Total</span>
                    <span className="text-2xl font-heading font-bold text-accent">Rs {total.toLocaleString()}</span>
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
