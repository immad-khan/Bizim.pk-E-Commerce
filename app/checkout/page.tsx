import Header from '@/components/header'
import Footer from '@/components/footer'
import CheckoutForm from '@/components/checkout-form'
import { Suspense } from 'react'

export const metadata = {
    title: 'Checkout — bizim.pk',
    description: 'Complete your order by providing your delivery details.',
}

export default function CheckoutPage() {
    return (
        <>
            <Header />
            <main className="bg-background min-h-screen py-12">
                <Suspense fallback={<div className="text-center text-foreground py-20">Loading checkout...</div>}>
                    <CheckoutForm />
                </Suspense>
            </main>
            <Footer />
        </>
    )
}
