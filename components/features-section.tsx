'use client'

import { Truck, Tag, RotateCcw, CreditCard } from 'lucide-react'

const features = [
  {
    icon: Truck,
    title: 'FREE SHIPPING',
    description: 'On orders over Rs 5000'
  },
  {
    icon: Tag,
    title: 'FREE MYSTERY SURPRISE',
    description: 'On all bags with every purchase'
  },
  {
    icon: RotateCcw,
    title: '30 DAY RETURNS',
    description: 'Easy returns within 30 days'
  },
  {
    icon: CreditCard,
    title: 'CASH ON DELIVERY',
    description: 'Pay securely when your order arrives'
  }
]

export default function FeaturesSection() {
  return (
    <section className="bg-background border-t border-border py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-secondary rounded-lg">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-sm font-bold text-foreground">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
