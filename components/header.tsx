'use client'

import { Menu, Search, ShoppingCart, X, Sun, Moon } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { useProductContext } from '@/lib/product-context'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)
  
  const { searchQuery, setSearchQuery } = useProductContext()

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(href)
  }

  const handleSearchToggle = () => {
    if (isSearchOpen && searchQuery) {
      // Execute search
      if (pathname !== '/collections') {
        router.push('/collections')
      }
    } else {
      setIsSearchOpen(!isSearchOpen)
      if (!isSearchOpen) {
        setTimeout(() => searchInputRef.current?.focus(), 100)
      }
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery && pathname !== '/collections') {
      router.push('/collections')
    }
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
            {/* Search Input Box */}
            {isSearchOpen && (
              <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center gap-1 animate-in fade-in slide-in-from-right-4 duration-300">
                <input 
                  type="text" 
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products or tags..." 
                  className="bg-slate-800/80 text-sm text-slate-200 px-4 py-1.5 rounded-l border border-slate-700 focus:outline-none focus:border-orange-500 w-48 transition-all"
                />
                <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 transition-colors">
                  <Search className="w-4 h-4" />
                </button>
                <button type="button" onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1.5 rounded-r transition-colors border border-l-0 border-slate-700">
                  <X className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Search Button Toggle */}
            {!isSearchOpen && (
              <button onClick={handleSearchToggle} className="p-2 hover:bg-slate-800 rounded transition">
                <Search className="w-5 h-5 text-slate-200" />
              </button>
            )}
            {isSearchOpen && (
               <button onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }} className="p-2 hover:bg-slate-800 rounded transition md:hidden">
                 <X className="w-5 h-5 text-slate-200" />
               </button>
            )}
            
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
        {isSearchOpen && (
          <form onSubmit={handleSearchSubmit} className="md:hidden pb-4 px-2 space-y-2 animate-in fade-in slide-in-from-top-2">
            <div className="flex">
              <input 
                type="text" 
                ref={searchInputRef}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products or tags..." 
                className="bg-slate-800/80 text-sm text-slate-200 px-4 py-2 w-full rounded-l border border-slate-700 outline-none focus:border-orange-500"
              />
              <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-r font-medium text-sm border border-orange-500">
                Find
              </button>
            </div>
          </form>
        )}

        {/* Existing Mobile Menu */}
        {isMenuOpen && !isSearchOpen && (
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
