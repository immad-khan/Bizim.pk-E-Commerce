'use client'

import { X, Plus, Minus } from 'lucide-react'

interface CartItemProps {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  onQuantityChange: (quantity: number) => void
  onRemove: () => void
}

export default function CartItem({
  id,
  name,
  price,
  image,
  quantity,
  onQuantityChange,
  onRemove
}: CartItemProps) {
  const total = price * quantity

  return (
    <div className="flex gap-4 py-6 border-b border-border">
      {/* Product Image */}
      <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden bg-secondary">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading font-bold text-foreground text-sm">{name}</h3>
          <p className="text-sm text-muted-foreground mt-1">Rs {price.toLocaleString()} each</p>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="p-1 hover:bg-secondary rounded transition"
          >
            <Minus className="w-4 h-4 text-foreground" />
          </button>
          <span className="w-8 text-center text-sm font-bold text-foreground">{quantity}</span>
          <button
            onClick={() => onQuantityChange(quantity + 1)}
            className="p-1 hover:bg-secondary rounded transition"
          >
            <Plus className="w-4 h-4 text-foreground" />
          </button>
        </div>
      </div>

      {/* Total and Remove */}
      <div className="flex flex-col items-end justify-between">
        <button
          onClick={onRemove}
          className="p-1 hover:bg-secondary rounded transition"
        >
          <X className="w-5 h-5 text-muted-foreground hover:text-accent" />
        </button>
        <p className="text-lg font-heading font-bold text-accent">Rs {total.toLocaleString()}</p>
      </div>
    </div>
  )
}
