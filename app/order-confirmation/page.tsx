import Header from '@/components/header'
import Footer from '@/components/footer'
import OrderConfirmationContent from '@/components/order-confirmation-content'
import { Suspense } from 'react'

export default function OrderConfirmationPage() {
  return (
    <>
      <Header />
      <main className="bg-background min-h-screen flex items-center justify-center py-12">
        <Suspense fallback={<div className="text-center text-foreground">Loading order details...</div>}>
          <OrderConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
