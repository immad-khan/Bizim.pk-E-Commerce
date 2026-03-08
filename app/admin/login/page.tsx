'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({
    adminId: '',
    password: ''
  })
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Admin credentials (hardcoded for demo - in production use proper backend)
    const ADMIN_ID = 'admin@bizim.pk'
    const ADMIN_PASSWORD = 'admin123'

    if (formData.adminId === ADMIN_ID && formData.password === ADMIN_PASSWORD) {
      setMessage('Admin login successful! Redirecting...')
      setTimeout(() => {
        window.location.href = '/admin/dashboard'
      }, 2000)
    } else {
      setMessage('Invalid Admin ID or Password!')
      setIsLoading(false)
    }
  }

  return (
    <main className="bg-background min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Admin Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-bold text-accent">bizim.pk</h1>
          <p className="text-muted-foreground text-sm mt-2">Admin Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-card rounded-lg p-8 border border-border space-y-6">
          {message && (
            <div className={`p-4 rounded-lg text-center ${
              message.includes('successful')
                ? 'bg-green-600/20 text-green-400 border border-green-600'
                : 'bg-red-600/20 text-red-400 border border-red-600'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Admin ID</label>
              <input
                type="text"
                name="adminId"
                value={formData.adminId}
                onChange={handleChange}
                required
                placeholder="admin@bizim.pk"
                className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-700 hover:bg-orange-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition"
            >
              {isLoading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>

          <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
            <p>Demo Credentials:</p>
            <p>ID: admin@bizim.pk</p>
            <p>Password: admin123</p>
          </div>
        </div>

        {/* Back to Store */}
        <div className="text-center mt-6">
          <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
            ← Back to Store
          </Link>
        </div>
      </div>
    </main>
  )
}
