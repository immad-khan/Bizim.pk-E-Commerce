'use client'

import Image from 'next/image'
import ModernButton from './modern-button'
import { useProductContext } from '@/lib/product-context'

export default function Sidebar() {
  const { selectedTags, setSelectedTags, maxPrice, setMaxPrice } = useProductContext();

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <aside className="hidden lg:block w-72 bg-background border-r border-border sticky top-24">
      <div className="p-6 space-y-8 max-h-[calc(100vh-120px)] overflow-y-auto">
        {/* Price Filter */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase mb-4">Filter by Price</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-xs text-muted-foreground font-medium">
              <span>Rs. 1,000</span>
              <span>Rs. {maxPrice.toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="7000" 
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase mb-4">Category</h3>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span>Leather</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span>Female</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span>For Laptop Bag</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span>High School</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span>University</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span>Large</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span>Medium</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span>Small</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span>XXL</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span>Backpack</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  )
}
