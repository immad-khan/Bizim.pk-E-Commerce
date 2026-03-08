import Header from '@/components/header'
import HeroGrid from '@/components/hero-grid'
import FeaturesSection from '@/components/features-section'
import CollectionsSection from '@/components/collections-section'
import FeaturedProducts from '@/components/featured-products'
import BannerSection from '@/components/banner-section'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroGrid />
      <FeaturesSection />
      <CollectionsSection />
      <FeaturedProducts />
      <BannerSection />
      <Footer />
    </main>
  )
}
