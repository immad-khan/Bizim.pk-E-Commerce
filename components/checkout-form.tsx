'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, MapPin, Phone, Mail, ShieldCheck, ChevronRight, AlertCircle } from 'lucide-react'
import { COUNTRY_CODES } from '@/lib/countryCodes'

interface CartItem {
      id: string
      name: string
      price: number
      image: string
      quantity: number
      shipmentFee?: number
    }

interface FormData {
    fullName: string
    gender: string
    city: string
    fullAddress: string
    email: string
    phoneCode: string
    phone: string
    emergencyPhoneCode: string
    emergencyPhone: string
}

const FIELDS = [
    { key: 'fullName', label: 'Full Name', placeholder: 'e.g. Ahmed Khan', icon: User, type: 'text' },
    { key: 'city', label: 'City', placeholder: 'e.g. Karachi', icon: MapPin, type: 'text' },
    { key: 'fullAddress', label: 'Full Address', placeholder: 'House/Flat No., Street, Area', icon: MapPin, type: 'text' },
    { key: 'email', label: 'Email Address', placeholder: 'you@example.com', icon: Mail, type: 'email' },
]

export default function CheckoutForm() {
    const router = useRouter()
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5264'
    const [cart, setCart] = useState<CartItem[]>([])
    const [form, setForm] = useState<FormData>({
        fullName: '', gender: '', city: '', fullAddress: '', email: '', 
        phoneCode: '+92', phone: '', 
        emergencyPhoneCode: '+92', emergencyPhone: ''
    })
    const [errors, setErrors] = useState<Partial<FormData>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [step, setStep] = useState<'form' | 'review'>('form')
    const [apiError, setApiError] = useState<string | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem('bizim-cart')
        if (saved) setCart(JSON.parse(saved))
    }, [])

    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
    
    const maxProductShipping = cart.length > 0 
      ? Math.max(...cart.map(i => i.shipmentFee !== undefined ? i.shipmentFee : 500))
      : 500
    const shipping = subtotal > 5000 ? 0 : maxProductShipping
    
    const tax = subtotal * 0.1
    const total = subtotal + shipping + tax

    const validate = () => {
        const e: Partial<FormData> = {}
        if (!form.fullName.trim()) e.fullName = 'Full name is required'
        if (!form.gender) e.gender = 'Please select gender'
        if (!form.city.trim()) e.city = 'City is required'
        if (!form.fullAddress.trim()) e.fullAddress = 'Full address is required'
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required'
        if (!/^\d{10}$/.test(form.phone)) e.phone = 'Valid 10-digit phone number is required (numbers only)'
        if (!/^\d{10}$/.test(form.emergencyPhone)) e.emergencyPhone = 'Valid 10-digit emergency number is required (numbers only)'
        setErrors(e)
        return Object.keys(e).length === 0
    }

    const handleContinue = () => {
        if (validate()) setStep('review')
    }

    const handleConfirm = async () => {
        setIsSubmitting(true)
        const orderId = `ORD-${Date.now()}`
        const customerId = crypto.randomUUID()
        
        // Prepare the payload for the .NET API
        const orderPayload = {
            orderId: orderId,
            status: 'Pending',
            placedAt: new Date().toISOString(),
            subtotal: subtotal,
            shipping: shipping,
            tax: tax,
            total: total,
            paymentMethod: 'Cash On Delivery',
            customerId,
            customer: {
                id: customerId,
                fullName: form.fullName,
                email: form.email,
                phone: `${form.phoneCode} ${form.phone}`,
                emergencyPhone: `${form.emergencyPhoneCode} ${form.emergencyPhone}`,
                city: form.city,
                fullAddress: form.fullAddress,
                gender: form.gender
            },
            items: cart.map(item => ({
                productId: item.id,
                productName: item.name,
                priceAtOrderTime: item.price,
                quantity: item.quantity
            }))
        }

        setApiError(null)

        try {
            const response = await fetch(`${API_BASE_URL}/api/Orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderPayload),
            })

            if (!response.ok) {
                const rawError = await response.text()
                console.error('Order API failed:', rawError)
                throw new Error('Failed to submit order. Please try again later.')
            }

            // Order succeeded, removing cart
            localStorage.removeItem('bizim-cart')
            const existingOrders = JSON.parse(localStorage.getItem('bizim-recent-orders') || '[]')
            existingOrders.unshift(orderId)
            localStorage.setItem('bizim-recent-orders', JSON.stringify(existingOrders.slice(0, 10)))

            setTimeout(() => {
                router.push(`/order-confirmation?orderId=${orderId}&amount=${Math.round(total)}`)
            }, 600)
        } catch (error) {
            console.error('Checkout API unreachable:', error)
            setApiError('Unable to place order. Please check your connection and try again.')
            setIsSubmitting(false)
        }
    }

    if (step === 'review') {
        return (
            <div className="w-full max-w-2xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-400">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 border border-accent/30 mb-4">
                        <ShieldCheck className="w-7 h-7 text-accent" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-foreground mb-1">Review Your Details</h1>
                    <p className="text-muted-foreground text-sm">Please confirm everything looks correct</p>
                </div>

                {/* Customer Details Card */}
                <div className="bg-card rounded-xl border border-border p-6 mb-6 space-y-3">
                    <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-4">Customer Information</h2>
                    {[
                        { label: 'Full Name', value: form.fullName },
                        { label: 'Gender', value: form.gender },
                        { label: 'City', value: form.city },
                        { label: 'Full Address', value: form.fullAddress },
                        { label: 'Email', value: form.email },
                        { label: 'Phone', value: `${form.phoneCode} ${form.phone}` },
                        { label: 'Emergency Phone', value: `${form.emergencyPhoneCode} ${form.emergencyPhone}` },
                    ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between items-start py-2 border-b border-border/50 last:border-0">
                            <span className="text-muted-foreground text-sm w-40 shrink-0">{label}</span>
                            <span className="text-foreground text-sm font-semibold text-right">{value}</span>
                        </div>
                    ))}
                </div>

                {/* Order Summary Card */}
                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                    <h2 className="text-sm font-bold text-accent uppercase tracking-wider mb-4">Order Summary</h2>
                    <div className="space-y-2 text-sm">
                        {cart.map(item => (
                            <div key={item.id} className="flex justify-between">
                                <span className="text-muted-foreground">{item.name} × {item.quantity}</span>
                                <span className="text-foreground font-medium">Rs {(item.price * item.quantity).toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="border-t border-border pt-3 mt-3 space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Subtotal</span><span>Rs {subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Shipping</span><span>{shipping === 0 ? 'Free' : `Rs ${shipping}`}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Tax (10%)</span><span>Rs {Math.round(tax).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-lg font-heading font-bold text-accent pt-2">
                                <span>Total</span><span>Rs {Math.round(total).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {apiError && (
                    <div className="mb-6 p-4 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <div className="text-sm text-rose-500 font-medium">
                            {apiError}
                        </div>
                    </div>
                )}

                <div className="flex gap-3">
                    <button
                        onClick={() => setStep('form')}
                        className="flex-1 py-3 rounded-lg border border-border text-foreground hover:bg-secondary transition font-medium text-sm"
                    >
                        ← Edit Details
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                        className="flex-2 py-3 rounded-lg bg-gradient-to-b from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 focus:ring-orange-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg hover:shadow-2xl"
                    >
                        {isSubmitting ? (
                            <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Placing Order...</>
                        ) : (
                            <><ShieldCheck className="w-4 h-4" /> Confirm & Place Order</>
                        )}
                    </button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                    💳 Cash on Delivery — pay when your order arrives
                </p>
            </div>
        )
    }

    return (
        <div className="w-full max-w-2xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-400">
            <div className="mb-8 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 border border-accent/30 mb-4">
                    <User className="w-7 h-7 text-accent" />
                </div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-1">Checkout</h1>
                <p className="text-muted-foreground text-sm">Please fill in your details to complete your order</p>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 sm:p-8 space-y-5">
                {/* Gender field */}
                <div>
                    <label className="block text-xs font-semibold text-accent uppercase tracking-wider mb-1.5">
                        Gender <span className="text-rose-500">*</span>
                    </label>
                    <select
                        value={form.gender}
                        onChange={e => setForm({ ...form, gender: e.target.value })}
                        className={`w-full bg-background border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition ${errors.gender ? 'border-rose-500' : 'border-border'}`}
                    >
                        <option value="">Select gender...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.gender && <p className="text-rose-500 text-xs mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.gender}</p>}
                </div>

                {/* Remaining fields */}
                {FIELDS.map(({ key, label, placeholder, icon: Icon, type }) => (
                    <div key={key}>
                        <label className="block text-xs font-semibold text-accent uppercase tracking-wider mb-1.5">
                            {label} <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type={type}
                                value={form[key as keyof FormData]}
                                onChange={e => setForm({ ...form, [key]: e.target.value })}
                                placeholder={placeholder}
                                className={`w-full bg-background border rounded-lg pl-10 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition ${errors[key as keyof FormData] ? 'border-rose-500' : 'border-border'}`}
                            />
                        </div>
                        {errors[key as keyof FormData] && (
                            <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{errors[key as keyof FormData]}
                            </p>
                        )}
                    </div>
                ))}

                {/* Phone fields */}
                {[
                    { key: 'phone', label: 'Phone Number', codeKey: 'phoneCode', icon: Phone },
                    { key: 'emergencyPhone', label: 'Emergency Phone Number', codeKey: 'emergencyPhoneCode', icon: ShieldCheck }
                ].map(({ key, label, codeKey, icon: Icon }) => (
                    <div key={key}>
                        <label className="block text-xs font-semibold text-accent uppercase tracking-wider mb-1.5">
                            {label} <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex gap-2 relative">
                            <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                            <select
                                value={form[codeKey as keyof FormData]}
                                onChange={e => setForm({ ...form, [codeKey]: e.target.value })}
                                className="w-24 bg-background border border-border rounded-lg pl-9 pr-2 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 transition appearance-none cursor-pointer"
                            >
                                {COUNTRY_CODES.map(c => (
                                    <option key={`${c.code}-${c.country}`} value={c.code}>
                                        {c.code}
                                    </option>
                                ))}
                            </select>
                            <input
                                type="tel"
                                maxLength={10}
                                value={form[key as keyof FormData]}
                                onChange={e => {
                                    const val = e.target.value.replace(/\D/g, ''); // only allow digits
                                    setForm({ ...form, [key]: val });
                                }}
                                placeholder="3XX XXXXXXX"
                                className={`flex-1 bg-background border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/40 transition ${errors[key as keyof FormData] ? 'border-rose-500' : 'border-border'}`}
                            />
                        </div>
                        {errors[key as keyof FormData] && (
                            <p className="text-rose-500 text-xs mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />{errors[key as keyof FormData]}
                            </p>
                        )}
                    </div>
                ))}

                {/* Mini order totals */}
                <div className="border-t border-border pt-5 flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                        {cart.reduce((s, i) => s + i.quantity, 0)} item(s) · Cash on Delivery
                    </div>
                    <div className="text-xl font-heading font-bold text-accent">
                        Rs {Math.round(total).toLocaleString()}
                    </div>
                </div>

                <button
                    onClick={handleContinue}
                    className="w-full py-3.5 font-bold rounded-2xl transition duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-2 text-white bg-gradient-to-b from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-sm"
                >
                    Review My Order <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
                Your personal details are stored securely and used only for delivery purposes.
            </p>
        </div>
    )
}
