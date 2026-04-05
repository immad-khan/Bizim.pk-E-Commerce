'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import Sidebar from '@/components/sidebar'
import ProductCard from '@/components/product-card'
import Pagination from '@/components/pagination'
import ProductDetailModal from '@/components/product-detail-modal'
import { useState } from 'react'
import { useProductContext, type Product } from '@/lib/product-context'

const PRODUCTS_PER_PAGE = 6

export default function CollectionsPage() {
  const { products, maxPrice } = useProductContext()
  const loading = false;
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sortOrder, setSortOrder] = useState<'default' | 'asc' | 'desc'>('default')

  const filteredProducts = products.filter(p => !p.price || p.price <= maxPrice)

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price
    if (sortOrder === 'desc') return b.price - a.price
    return 0
  })

  // We should make sure totalPages is at least 1
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE))
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const displayedProducts = sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <>
      <Header />
      <main className="bg-background min-h-screen">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Collections</h1>
            <p className="text-muted-foreground text-sm md:text-base">Browse all our premium bag collections</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <Sidebar />

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <p className="text-xs sm:text-sm text-muted-foreground font-medium">Showing {displayedProducts.length} of {sortedProducts.length} products</p>
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

              {loading ? (
                <div className="flex justify-center items-center py-20 text-muted-foreground">
                  Loading products...
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-6 sm:gap-8 mb-8">
                    {displayedProducts.map((product, index) => (
                      <ProductCard
                        key={index}
                        name={product.name}
                        price={product.price}
                        originalPrice={product.originalPrice}
                        rating={product.rating}
                        reviews={product.reviews}
                        badge={product.badge || undefined}
                        badgeColor={product.badgeColor as 'orange' | 'red'}
                        image={product.image}
                        onClick={() => handleProductClick(product)}
                      />
                    ))}
                  </div>

                  {sortedProducts.length > 0 && (
                    <>
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
                    </>
                  )}

                  {sortedProducts.length === 0 && !loading && (
                    <div className="flex justify-center items-center py-20 text-muted-foreground">
                      No products found.
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

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
