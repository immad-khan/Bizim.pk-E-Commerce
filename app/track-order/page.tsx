'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ModernButton from '@/components/modern-button'
import { Package, Search, Truck, CheckCircle, Clock } from 'lucide-react'

// Define Order status colors
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return 'text-green-500 bg-green-500/10 border-green-500/30'
    case 'shipped': return 'text-blue-500 bg-blue-500/10 border-blue-500/30'
    case 'processing': return 'text-amber-500 bg-amber-500/10 border-amber-500/30'
    case 'cancelled': return 'text-red-500 bg-red-500/10 border-red-500/30'
    default: return 'text-slate-400 bg-slate-400/10 border-slate-400/30'
  }
}

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return <CheckCircle className="w-5 h-5" />
    case 'shipped': return <Truck className="w-5 h-5" />
    case 'processing': return <Package className="w-5 h-5" />
    default: return <Clock className="w-5 h-5" />
  }
}

export default function TrackOrderPage() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5264'
  const [searchInput, setSearchInput] = useState('')
  const [recentOrders, setRecentOrders] = useState<string[]>([])
  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  
  // Review Formulation State
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [reviewSaving, setReviewSaving] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('bizim-recent-orders')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setRecentOrders(parsed)
      } catch (e) {}
    }
  }, [])

  const trackOrder = async (orderId: string) => {
    if (!orderId) return
    setSearchInput(orderId)
    setLoading(true)
    setError('')
    setOrderData(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5264'}/api/Orders/track/${orderId}`)
      if (!res.ok) throw new Error('Order not found. Please verify your Tracking ID.')
      const data = await res.json()
      setOrderData(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const openReviewModal = (item: any) => {
    setSelectedProduct(item)
    setShowReviewModal(true)
  }

  const submitReview = async () => {
    if (!reviewText.trim()) return
    setReviewSaving(true)
    try {
      await fetch('/api/Reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.image, // For now assuming productId was mapped to it
          customerName: orderData?.customerName || 'Verified Buyer',
          rating: reviewRating,
          comment: reviewText
        })
      });
      alert('Review submitted successfully! Thank you.')
      setShowReviewModal(false)
      setReviewText('')
    } catch(err) {
      alert('Failed to submit review.')
    } finally {
      setReviewSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#111] flex flex-col text-slate-200">
      <Header />
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 mt-10">
        <h1 className="text-3xl font-bold text-white mb-2">Track Your Order</h1>
        <p className="text-slate-400 mb-8">Enter your tracking ID to see the current status or select a recent order below.</p>

        {/* Search Box */}
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text" 
              placeholder="e.g. ORD-123456" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#222] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>
          <ModernButton onClick={() => trackOrder(searchInput)} disabled={loading || !searchInput.trim()} className="py-3 px-8">
            {loading ? 'Tracking...' : 'Track Order'}
          </ModernButton>
        </div>

        {/* Recent Orders quick buttons */}
        {recentOrders.length > 0 && !orderData && !loading && (
          <div className="mb-10">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Your Recent Device Orders</h3>
            <div className="flex flex-wrap gap-3">
              {recentOrders.map(oid => (
                <button 
                  key={oid} 
                  onClick={() => trackOrder(oid)}
                  className="px-4 py-2 bg-slate-800 hover:bg-orange-500/20 hover:text-orange-400 border border-slate-700 hover:border-orange-500/50 rounded-full text-sm transition-all"
                >
                  {oid}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 font-medium rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {orderData && (
          <div className="bg-[#1a1a1a] rounded-xl border border-slate-800 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">Order {orderData.orderId}</h2>
                <div className="text-sm text-slate-400">Placed on {new Date(orderData.placedAt).toLocaleDateString()}</div>
              </div>
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm w-fit`}>
                {getStatusIcon(orderData.status)}
                {orderData.status}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-2">Items inside</h3>
              {orderData.items.map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 bg-[#222] rounded-lg border border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-800 rounded flex items-center justify-center text-slate-500">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-200">{item.name}</div>
                      <div className="text-sm text-slate-400">Qty: {item.quantity} · Rs {item.price?.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* If delivered, allow reviewing */}
                  {orderData.status?.toLowerCase() === 'delivered' && (
                    <button onClick={() => openReviewModal(item)} className="px-4 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 text-sm font-medium rounded-full transition-colors border border-orange-500/20 hover:border-orange-500/50">
                      Write Review
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center text-lg">
              <span className="font-semibold text-slate-400">Total Charged</span>
              <span className="font-bold text-white">Rs {orderData.total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </main>
      
      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] rounded-xl border border-slate-800 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-1">Write a Review</h3>
              <p className="text-sm text-slate-400 mb-6">Tell us what you think about {selectedProduct?.name}</p>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">How would you rate it?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} onClick={() => setReviewRating(star)} className={`text-2xl transition-colors`}>★</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-300 mb-2">Your Feedback</label>
                <textarea 
                  rows={4}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full p-3 bg-[#111] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500 transition-colors resize-none placeholder-slate-600"
                  placeholder="I loved this product because..."
                />
              </div>

              <div className="flex gap-3 justify-end mt-8">
                <button onClick={() => setShowReviewModal(false)} className="px-5 py-2 rounded-lg font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                  Cancel
                </button>
                <ModernButton onClick={submitReview} disabled={reviewSaving}>
                  {reviewSaving ? 'Submitting...' : 'Submit Feedback'}
                </ModernButton>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  )
}

