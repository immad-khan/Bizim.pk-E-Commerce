'use client'

import { Facebook, Instagram, Twitter, Mail } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import ModernButton from './modern-button'

export default function Footer() {
  const [newsletter, setNewsletter] = useState('')
  const [subscribeMessage, setSubscribeMessage] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newsletter) {
      setIsSubscribing(true)
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5264'
        const response = await fetch(`${apiUrl}/api/Subscribers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ Email: newsletter }),
        })

        if (response.ok) {
          setSubscribeMessage('Thank you for subscribing!')
          setNewsletter('')
        } else {
          try {
            const errorText = await response.text();
            setSubscribeMessage(errorText || 'Failed to subscribe. Please try again.')
          } catch {
             setSubscribeMessage('Failed to subscribe. Please try again.')
          }
        }
      } catch (error) {
        console.error('Subscription error:', error)
        setSubscribeMessage('An error occurred. Please try again later.')
      } finally {
        setIsSubscribing(false)
        setTimeout(() => setSubscribeMessage(''), 5000)
      }
    }
  }

  return (
    <footer className="bg-background border-t border-border text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-16 border-b border-border">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h3 className="text-3xl font-heading font-bold text-foreground">
              Subscribe to Exclusive Offers
            </h3>
            <p className="text-muted-foreground">
              Get early access to new collections, special discounts, and exclusive deals delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-input border border-border px-4 py-3 text-sm rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition disabled:opacity-50"
                required
                disabled={isSubscribing}
              />
              <ModernButton
                type="submit"
                className="py-2 px-4 text-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubscribing}
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </ModernButton>
            </form>
            {subscribeMessage && (
              <p className="text-accent text-sm">{subscribeMessage}</p>
            )}
          </div>
        </div>

        {/* Main Footer */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="space-y-4 md:col-span-1">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-heading font-bold text-accent hover:text-orange-600 transition">bizim.pk</span>
              </Link>
              <p className="text-sm text-muted-foreground">
                Premium luxury bags for the discerning collector.
              </p>
            </div>

            {/* Shop */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground uppercase">Shop</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-muted-foreground hover:text-accent transition">All Bags</Link></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-accent transition">Women's</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-accent transition">Men's</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-accent transition">Sale</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground uppercase">Support</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-accent transition">About Us</Link></li>
                <li><Link href="/track-order" className="text-sm text-accent transition hover:-translate-y-0.5 font-medium">Track Order</Link></li>
                <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-accent transition">Contact Us</Link></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-accent transition">Shipping Info</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-accent transition">Returns</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground uppercase">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-accent transition">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-accent transition">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-accent transition">Sitemap</a></li>
              </ul>
            </div>

            {/* Admin */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-foreground uppercase">Admin</h4>
              <ul className="space-y-2">
                <li><Link href="/admin/login" className="text-sm text-muted-foreground hover:text-accent transition">Admin Portal</Link></li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border my-8"></div>

          {/* Bottom */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-sm text-muted-foreground">
              &copy; 2024 bizim.pk. All rights reserved.
            </p>

            {/* Social Links - Circular with borders */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-border hover:border-accent hover:text-accent transition flex items-center justify-center">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border hover:border-accent hover:text-accent transition flex items-center justify-center">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border hover:border-accent hover:text-accent transition flex items-center justify-center">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-border hover:border-accent hover:text-accent transition flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
