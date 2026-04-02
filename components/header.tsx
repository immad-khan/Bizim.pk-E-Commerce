'use client'

import { Menu, Search, ShoppingCart, X, Sun, Moon } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const getLinkClass = (href: string) => {
    const baseClass = 'text-lg font-semibold transition'
    if (isActive(href)) {
      return `${baseClass} text-orange-500 text-xl`
    }
    return `${baseClass} text-slate-300 hover:text-orange-500`
  }

  useEffect(() => {
    // Load cart count
    const cart = JSON.parse(localStorage.getItem('bizim-cart') || '[]')
    const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0)
    setCartCount(count)

    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#060b14]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img src="/logo.png" alt="Bizim.pk" className="h-8 md:h-10 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            <Link href="/" className={getLinkClass('/')}>
              Shop All
            </Link>
            <Link 
              href="/collections" 
              className={getLinkClass('/collections')}
            >
              Shop By Collection
            </Link>
            <Link href="/about" className={getLinkClass('/about')}>
              About
            </Link>
            <Link href="/contact" className={getLinkClass('/contact')}>
              Contact
            </Link>
          </nav>

          {/* Right Icons and Buttons */}
          <div className="flex items-center gap-3">
            {/* Search Button */}
            <button className="p-2 hover:bg-slate-800 rounded transition">
              <Search className="w-5 h-5 text-slate-200" />
            </button>

            {/* Cart Counter */}
            <Link href="/cart" className="p-2 hover:bg-slate-800 rounded transition relative inline-flex">
              <ShoppingCart className="w-5 h-5 text-slate-200" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-gradient-to-b from-orange-500 to-orange-700 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center transform scale-110">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-slate-800 rounded transition"
              title={mounted ? `Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode` : 'Switch theme'}
            >
              {mounted && (
                resolvedTheme === 'dark' ? (
                  <Sun className="w-5 h-5 text-white" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-200" />
                )
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 md:hidden hover:bg-slate-800 rounded transition"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-slate-200" />
              ) : (
                <Menu className="w-5 h-5 text-slate-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 space-y-2" style={{ fontFamily: "'Bodoni Moda', serif" }}>
            <Link href="/" className={`block py-2 ${getLinkClass('/')}`}>
              Shop All
            </Link>
            <Link 
              href="/collections" 
              className={`block py-2 ${getLinkClass('/collections')}`}
            >
              Shop By Collection
            </Link>
            <Link href="/about" className={`block py-2 ${getLinkClass('/about')}`}>
              About
            </Link>
            <Link href="/contact" className={`block py-2 ${getLinkClass('/contact')}`}>
              Contact
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
