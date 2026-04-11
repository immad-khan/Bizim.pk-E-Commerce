import Header from '@/components/header'
import HeroGrid from '@/components/hero-grid'
import FeaturesSection from '@/components/features-section'
import CollectionsSection from '@/components/collections-section'
import FeaturedProducts from '@/components/featured-products'
import BannerSection from '@/components/banner-section'
import Footer from '@/components/footer'
import ScrollAnimation from '@/components/scroll-animation'
import { SiteCustomization } from '@/lib/site-customization'

async function getCustomizations(): Promise<SiteCustomization | null> {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5264';
    const res = await fetch(`${API_BASE_URL}/api/Customizations`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

export default async function Home() {
  const customizations = await getCustomizations();

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ScrollAnimation customizations={customizations} />
      <div className="h-16 md:h-24 w-full bg-[#0a0a0a]" aria-hidden="true" />
      <HeroGrid customizations={customizations} />
      <FeaturesSection />
      <CollectionsSection />
      <FeaturedProducts />
      <BannerSection />
      <Footer />
    </main>
  )
}
