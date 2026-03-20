import Header from '@/components/header'
import HeroGrid from '@/components/hero-grid'
import FeaturesSection from '@/components/features-section'
import CollectionsSection from '@/components/collections-section'
import FeaturedProducts from '@/components/featured-products'
import BannerSection from '@/components/banner-section'
import Footer from '@/components/footer'
import ScrollAnimation from '@/components/scroll-animation'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      {/* Scroll-driven bag teardown animation — appears first behind navbar */}
      <ScrollAnimation />
      
      {/* Smooth transition strip from animation to grid */}
      <div className="h-16 md:h-24 w-full bg-[#0a0a0a]" aria-hidden="true" />

      <HeroGrid />
      <FeaturesSection />
      <CollectionsSection />
      <FeaturedProducts />
      <BannerSection />
      <Footer />
    </main>
  )
}
