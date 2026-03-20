'use client'

import Header from '@/components/header'
import Footer from '@/components/footer'
import Link from 'next/link'
import ModernButton from '@/components/modern-button'

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Hero Section */}
        <section className="py-20 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-heading font-bold text-foreground">
                About bizim.pk
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Premium luxury bags crafted with passion, delivered with care
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="aspect-video rounded-lg overflow-hidden bg-secondary order-2 md:order-1">
                <img
                  src="https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048"
                  alt="About bizim.pk"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-6 order-1 md:order-2">
                <div className="space-y-2">
                  <p className="text-accent text-sm font-bold uppercase">About Us</p>
                  <h2 className="text-4xl font-heading font-bold text-foreground">
                    We Always Make The Best
                  </h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  bizim.pk was founded with a simple vision: to bring the world's most exquisite luxury bags to customers in Pakistan. We believe that everyone deserves to own pieces that reflect their style, sophistication, and personality.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our curated collection features hand-picked pieces from renowned brands and emerging designers. Each bag in our collection represents the pinnacle of craftsmanship, design, and luxury.
                </p>
                <Link href="/contact">
                  <ModernButton>Contact Us</ModernButton>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="py-20 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              Our Skills
            </h2>
            <p className="text-muted-foreground mb-12 max-w-2xl">
              We combine decades of expertise in luxury goods curation, quality assurance, and customer service to bring you the finest collection of premium bags.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Skills with Progress */}
              <div className="space-y-8">
                {[
                  { name: 'Bag Curation', percentage: 95 },
                  { name: 'Quality Assurance', percentage: 98 },
                  { name: 'Customer Service', percentage: 97 },
                  { name: 'Design Expertise', percentage: 92 }
                ].map((skill, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-foreground font-semibold">{skill.name}</span>
                      <span className="text-accent font-bold">{skill.percentage}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-accent h-full rounded-full transition-all duration-500"
                        style={{ width: `${skill.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: '15+', label: 'Years of Experience' },
                  { number: '1000+', label: 'Products Curated' },
                  { number: '5000+', label: 'Happy Customers' },
                  { number: '50+', label: 'Brand Partners' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-card rounded-lg p-6 text-center space-y-2">
                    <p className="text-3xl font-heading font-bold text-accent">{stat.number}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-12">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Quality',
                  description: 'We only curate bags that meet our highest standards of craftsmanship and design.'
                },
                {
                  title: 'Authenticity',
                  description: 'Every piece in our collection is authentic and comes with proper documentation.'
                },
                {
                  title: 'Customer Care',
                  description: 'Your satisfaction is our priority. We offer 30-day returns and exceptional support.'
                }
              ].map((value, idx) => (
                <div key={idx} className="bg-card rounded-lg p-8 text-center space-y-4">
                  <h3 className="text-xl font-heading font-bold text-foreground">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-12">
              Why Choose bizim.pk?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                'Curated collection of premium luxury bags',
                'Free mystery gift with every purchase',
                'Secure cash on delivery payment',
                'Free shipping on orders over Rs 5000',
                '30-day return guarantee',
                '24/7 customer support',
                'Authentic products with documentation',
                'Exclusive limited edition pieces'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-4">
                  <div className="flex-shrink-0 text-accent text-2xl">✓</div>
                  <p className="text-muted-foreground">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-heading font-bold text-foreground text-center mb-12">
              Our Mission
            </h2>
            <div className="bg-card rounded-lg p-12 text-center max-w-3xl mx-auto">
              <p className="text-lg text-muted-foreground leading-relaxed">
                At bizim.pk, our mission is to make luxury accessible and affordable for everyone. We're dedicated to providing exceptional quality, outstanding service, and unforgettable shopping experiences. We believe that luxury is not just about the product – it's about the journey, the care, and the connection between the brand and its customers.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
