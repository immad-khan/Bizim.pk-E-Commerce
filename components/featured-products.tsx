'use client'

import { useState } from 'react'
import { useProductContext, Product } from '@/lib/product-context'
import ProductCard from './product-card'
import ProductDetailModal from './product-detail-modal'
import Pagination from './pagination'
import Sidebar from './sidebar'

const PRODUCTS_PER_PAGE = 6

export default function FeaturedProducts() {
  const { products: allProducts, maxPrice, selectedTags, searchQuery } = useProductContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default')

  const filteredProducts = allProducts.filter(p => {
    // Price filter
    const matchesPrice = !p.price || p.price <= maxPrice;
    
    // Category/Tag filter
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag =>   
      p.tags?.toLowerCase().includes(tag.toLowerCase()) ||
      p.name?.toLowerCase().includes(tag.toLowerCase())
    );

    // Search filter
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPrice && matchesTags && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price
    if (sortOrder === 'desc') return b.price - a.price
    return 0
  })

  // We should make sure totalPages is at least 1
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE))
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const displayedProducts = sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

  const handleProductClick = (product: typeof allProducts[0]) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <section className="relative py-16 border-t border-border overflow-hidden bg-background">

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Featured Collections</h2>
          <p className="text-muted-foreground text-sm md:text-base">Discover our latest premium selections</p>
        </div>

        {/* Main Content with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          {/* Sidebar */}
          <Sidebar />

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">Showing {displayedProducts.length} products</p>
              <div className="w-full sm:w-auto">
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value as 'default' | 'asc' | 'desc')
                    setCurrentPage(1)
                  }}
                  className="w-full sm:w-auto bg-secondary text-foreground border border-border rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-secondary/80 transition focus:outline-none focus:ring-2 focus:ring-accent/50"
                >
                  <option value="default">Default Sorting</option>
                  <option value="asc">By Price: Low to High</option>
                  <option value="desc">By Price: High to Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-8 mb-8">
              {displayedProducts.map((product, index) => (
                <ProductCard
                  key={index}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  rating={product.rating}
                  reviews={product.reviews}
                  badgeColor={product.badgeColor as 'orange' | 'red'}
                  image={product.image}
                  badge={product.badge === null ? undefined : product.badge}
                  onSale={product.onSale}
                  saleDiscount={product.saleDiscount}
                  quantity={product.quantity}
                  onClick={() => handleProductClick(product)}
                />
              ))}
            </div>

            {/* Pagination */}
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
    </section>
  )
}
