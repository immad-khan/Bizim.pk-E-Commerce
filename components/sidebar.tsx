'use client'

import Image from 'next/image'
import ModernButton from './modern-button'

export default function Sidebar() {
  const latestProducts = [
    {
      name: 'Shepherd Hook Bracelet',
      price: '$30.00 - $100.00',
      image: 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048'
    },
    {
      name: 'Jhumka Earrings',
      price: '$20.00 - $90.00',
      image: 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048'
    },
    {
      name: 'Dangling Earrings',
      price: '$10.00 - $60.00',
      image: 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048'
    }
  ]

  const instagramImages = [
    'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048',
    'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048',
    'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048',
    'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048',
    'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048',
    'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048',
    'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048',
    'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048',
    'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048',
  ]

  return (
    <aside className="hidden lg:block w-72 bg-background border-r border-border sticky top-24">
      <div className="p-6 space-y-8 max-h-[calc(100vh-120px)] overflow-y-auto">
        {/* Price Filter */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase mb-4">Filter by Price</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Min Price" 
                className="flex-1 px-3 py-2 text-sm bg-card border border-border rounded text-foreground placeholder-muted-foreground"
              />
              <input 
                type="text" 
                placeholder="Max Price" 
                className="flex-1 px-3 py-2 text-sm bg-card border border-border rounded text-foreground placeholder-muted-foreground"
              />
            </div>
            <ModernButton className="w-full py-2">Apply</ModernButton>
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

        {/* Latest Products */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase mb-4">Latest Products</h3>
          <div className="space-y-4">
            {latestProducts.map((product, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-card">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-bold text-foreground text-[11px] line-clamp-2">{product.name}</p>
                  <p className="text-muted-foreground mt-1">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram Feed */}
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase mb-4">Instagram</h3>
          <div className="grid grid-cols-3 gap-2">
            {instagramImages.map((img, index) => (
              <div key={index} className="aspect-square rounded overflow-hidden bg-card hover:opacity-80 transition cursor-pointer">
                <img 
                  src={img} 
                  alt="Instagram"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
