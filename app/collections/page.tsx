'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import Sidebar from '@/components/sidebar'
import ProductCard from '@/components/product-card'
import Pagination from '@/components/pagination'
import ProductDetailModal from '@/components/product-detail-modal'
import { useState } from 'react'

const BAG_IMAGE = 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048'

const allProducts = [
  {
    name: 'Premium Leather Tote',
    price: 5499,
    originalPrice: 7999,
    rating: 5,
    reviews: 125,
    badge: 'SALE',
    image: BAG_IMAGE
  },
  {
    name: 'Classic Crossbody Bag',
    price: 3999,
    originalPrice: 5499,
    rating: 5,
    reviews: 98,
    badge: null,
    image: BAG_IMAGE
  },
  {
    name: 'Designer Handbag',
    price: 8999,
    originalPrice: 11999,
    rating: 5,
    reviews: 156,
    badge: 'HOT',
    badgeColor: 'red',
    image: BAG_IMAGE
  },
  {
    name: 'Student Backpack',
    price: 2499,
    originalPrice: 3999,
    rating: 5,
    reviews: 87,
    badge: 'SALE',
    image: BAG_IMAGE
  },
  {
    name: 'Laptop Messenger Bag',
    price: 6499,
    originalPrice: 8499,
    rating: 5,
    reviews: 112,
    badge: null,
    image: BAG_IMAGE
  },
  {
    name: 'Travel Weekender',
    price: 4999,
    originalPrice: 6999,
    rating: 5,
    reviews: 104,
    badge: 'HOT',
    badgeColor: 'red',
    image: BAG_IMAGE
  },
  {
    name: 'Luxury Satchel',
    price: 9999,
    originalPrice: 13499,
    rating: 5,
    reviews: 142,
    badge: 'SALE',
    image: BAG_IMAGE
  },
  {
    name: 'Urban Daypack',
    price: 3499,
    originalPrice: 4999,
    rating: 5,
    reviews: 95,
    badge: null,
    image: BAG_IMAGE
  },
  {
    name: 'Executive Briefcase',
    price: 7999,
    originalPrice: 10499,
    rating: 5,
    reviews: 127,
    badge: 'HOT',
    badgeColor: 'red',
    image: BAG_IMAGE
  },
  {
    name: 'Fashion Shopper',
    price: 4499,
    originalPrice: 5999,
    rating: 5,
    reviews: 89,
    badge: null,
    image: BAG_IMAGE
  },
  {
    name: 'College Rucksack',
    price: 3199,
    originalPrice: 4799,
    rating: 5,
    reviews: 76,
    badge: 'SALE',
    image: BAG_IMAGE
  },
  {
    name: 'Evening Clutch',
    price: 2999,
    originalPrice: 4299,
    rating: 5,
    reviews: 64,
    badge: null,
    image: BAG_IMAGE
  }
]

const PRODUCTS_PER_PAGE = 6

export default function CollectionsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default')

  const sortedProducts = [...allProducts].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price
    if (sortOrder === 'desc') return b.price - a.price
    return 0
  })

  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE)
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const displayedProducts = sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

  const handleProductClick = (product: typeof allProducts[0]) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-12">
            <h1 className="text-4xl font-heading font-bold text-foreground mb-2">Collections</h1>
            <p className="text-muted-foreground">Browse all our premium bag collections</p>
          </div>

          <div className="flex gap-8">
            <Sidebar />

            <div className="flex-1">
              {/* Sort Controls */}
              <div className="flex justify-between items-center mb-8">
                <p className="text-sm text-muted-foreground">Showing {displayedProducts.length} of {sortedProducts.length} products</p>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value as 'default' | 'asc' | 'desc')
                    setCurrentPage(1)
                  }}
                  className="bg-secondary text-foreground border border-border rounded px-4 py-2 text-sm font-semibold hover:bg-secondary/80 transition"
                >
                  <option value="default">Default Sorting</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {displayedProducts.map((product, index) => (
                  <ProductCard
                    key={index}
                    name={product.name}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    rating={product.rating}
                    reviews={product.reviews}
                    badge={product.badge}
                    badgeColor={product.badgeColor as 'orange' | 'red'}
                    image={product.image}
                    onClick={() => handleProductClick(product)}
                  />
                ))}
              </div>

              {/* Page Info and Pagination */}
              <div className="text-center mb-4">
                <p className="text-muted-foreground text-sm">
                  Page <span className="font-bold text-foreground">{currentPage}</span> of <span className="font-bold text-foreground">{totalPages}</span>
                </p>
              </div>
              
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <ProductDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            product={selectedProduct}
          />
        )}
      </main>
      <Footer />
    </>
  )
}
