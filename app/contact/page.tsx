'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import ModernButton from '@/components/modern-button'

export default function ContactPage() {
  const [customizations, setCustomizations] = useState<any>(null)

  useEffect(() => {
    const fetchCustomizations = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5264';
        const res = await fetch(`${API_BASE_URL}/api/Customizations`);
        if (res.ok) {
          const data = await res.json();
          setCustomizations(data);
        }
      } catch (err) {
        console.error('Error fetching customizations:', err);
      }
    };
    fetchCustomizations();
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage('')

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5264'
      const response = await fetch(`${apiUrl}/api/ContactMessages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: formData.name,
          Email: formData.email,
          Phone: formData.phone || '',
          Subject: formData.subject || 'General Inquiry',
          Message: formData.message
        }),
      })

      if (response.ok) {
        setSubmitMessage('Thank you for your message! We\'ll get back to you soon.')
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        })
      } else {
        setSubmitMessage('Oops! Something went wrong. Please try again.')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitMessage('Oops! Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
      setTimeout(() => {
        setSubmitMessage('')
      }, 5000)
    }
  }

  return (
    <>
      <Header />
      <main className="bg-background">
        {/* Hero Section */}
        <section className="py-20 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-5xl font-heading font-bold text-foreground">
                Contact Us
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We'd love to hear from you. Get in touch with our team for any inquiries or support.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form and Info Layout */}
        <section className="py-20 border-b border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Form Column */}
              <div className="space-y-8">
                <div className="space-y-2">
                  <p className="text-accent text-sm font-bold uppercase">Contact Us</p>
                  <h2 className="text-3xl font-heading font-bold text-foreground">
                    Get In Touch
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitMessage && (
                    <div className="bg-green-600/20 border border-green-600 text-green-400 px-4 py-3 rounded-lg text-center">
                      {submitMessage}
                    </div>
                  )}

                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Your Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition"
                      placeholder="Your name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition"
                      placeholder="+92 (321) 111-1111"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Message</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition resize-none"
                      placeholder="Your message here..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="w-full">
                    <ModernButton
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </ModernButton>
                  </div>
                </form>
              </div>

              {/* Info Column */}
              <div className="space-y-8">
                <div className="bg-card rounded-lg p-8 space-y-8">
                  {/* Contact Cards */}
                  <div className="space-y-6">
                    {[
                      {
                        icon: Phone,
                        title: 'Phone Number',
                        content: customizations?.contactPhone || '+92 (321) 111-1111',
                        subtitle: 'Call us anytime'
                      },
                      {
                        icon: Mail,
                        title: 'Email Address',
                        content: customizations?.contactEmail || 'info@bizim.pk',
                        subtitle: 'Response within 24 hours'
                      },
                      {
                        icon: MapPin,
                        title: 'Our Office',
                        content: customizations?.contactAddress || 'Karachi, Pakistan',
                        subtitle: 'Head Office location'
                      }
                    ].map((contact, idx) => {
                      const Icon = contact.icon
                      return (
                        <div key={idx} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-secondary rounded">
                              <Icon className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-foreground uppercase">{contact.title}</h4>
                              <p className="text-foreground font-semibold mt-1">{contact.content}</p>
                              <p className="text-xs text-muted-foreground mt-1">{contact.subtitle}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Contact Image Placeholder */}
                <div className="rounded-lg overflow-hidden bg-secondary h-64">
                  <img 
                    src={customizations?.contactImage || "https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048"}
                    alt="Office location"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-secondary">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h2 className="text-4xl font-heading font-bold text-foreground">
                We Are Always Ready To Take A Perfect Shot
              </h2>
              <ModernButton>Shop Now</ModernButton>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-heading font-bold text-foreground text-center mb-12">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                {
                  q: 'What is the delivery time?',
                  a: 'We deliver within 3-5 business days in Karachi and 5-7 business days across Pakistan. Express delivery is available for an additional fee.'
                },
                {
                  q: 'Is cash on delivery available?',
                  a: 'Yes! Cash on delivery is our primary payment method. You can pay securely when your order arrives.'
                },
                {
                  q: 'What is your return policy?',
                  a: 'We offer a 30-day return guarantee. If you\'re not satisfied, simply contact us for a hassle-free return.'
                },
                {
                  q: 'Do you ship internationally?',
                  a: 'Currently, we deliver within Pakistan. International shipping will be available soon.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-card rounded-lg p-6 border border-border">
                  <h4 className="text-lg font-heading font-bold text-foreground mb-2">
                    {faq.q}
                  </h4>
                  <p className="text-muted-foreground">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
