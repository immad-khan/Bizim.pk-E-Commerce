'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import ModernButton from './modern-button'

export default function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId') || `ORD-${Date.now()}`
  const amount = searchParams.get('amount') || '0'

  const whatsappMessage = encodeURIComponent(
    `Hi! I have an order with ID: ${orderId}. I would like to get more details about my delivery.`
  )
  const whatsappLink = `https://wa.me/923355847267?text=${whatsappMessage}`

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      {/* Success Icon */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600/20 rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-4xl font-heading font-bold text-foreground mb-2">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground">Your order has been successfully placed</p>
      </div>

      {/* Order Details Card */}
      <div className="bg-card rounded-lg border border-border p-8 mb-8 space-y-6">
        {/* Order ID */}
        <div className="border-b border-border pb-6">
          <p className="text-muted-foreground text-sm mb-1">Order ID</p>
          <p className="text-2xl font-heading font-bold text-accent">{orderId}</p>
        </div>

        {/* Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-muted-foreground text-sm mb-2">Order Amount</p>
            <p className="text-2xl font-heading font-bold text-foreground">Rs {parseInt(amount).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-2">Estimated Delivery</p>
            <p className="text-2xl font-heading font-bold text-foreground">3 Working Days</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-2">Payment Method</p>
            <p className="text-lg font-semibold text-foreground">Cash on Delivery</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm mb-2">Status</p>
            <p className="text-lg font-semibold text-green-500">Confirmed</p>
          </div>
        </div>

        {/* What's Next */}
        <div className="border-t border-border pt-6">
          <h3 className="text-lg font-heading font-bold text-foreground mb-4">What's Next?</h3>
          <ul className="space-y-3">
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span className="text-foreground">Your order is being prepared for shipment</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span className="text-foreground">You will receive tracking information via email and WhatsApp</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span className="text-foreground">Delivery will be completed within 3 working days</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold">✓</span>
              <span className="text-foreground">Free mystery gift included with your purchase</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-card rounded-lg border border-border p-8 mb-8">
        <h3 className="text-lg font-heading font-bold text-foreground mb-6">Have Questions?</h3>
        <p className="text-muted-foreground mb-6">
          Contact us on WhatsApp for instant assistance. Our team is available 24/7 to help you track your order and answer any questions.
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg transition text-lg"
        >
          📱 Contact Us on WhatsApp
        </a>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Click the button above to open WhatsApp with your order ID pre-filled
        </p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/">
          <ModernButton className="w-full text-center">Continue Shopping</ModernButton>
        </Link>
        <Link href="/cart">
          <ModernButton variant="secondary" className="w-full text-center">View Cart</ModernButton>
        </Link>
      </div>

      {/* Email Confirmation */}
      <div className="text-center mt-8 p-6 bg-secondary rounded-lg">
        <p className="text-foreground text-sm">
          A confirmation email has been sent to your registered email address with order details and tracking information.
        </p>
      </div>
    </div>
  )
}
