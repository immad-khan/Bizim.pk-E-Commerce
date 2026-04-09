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
    <section className="bg-background border-t border-border py-8 sm:py-16">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                <div className="p-3 sm:p-3 bg-secondary rounded-xl border border-border/50">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-foreground leading-tight uppercase tracking-wider">{feature.title}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 max-w-[120px] mx-auto">{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
