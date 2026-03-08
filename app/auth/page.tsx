'use client'

import { useState } from 'react'
import Link from 'next/link'
import ModernButton from '@/components/modern-button'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      setMessage('Login successful! Redirecting...')
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    } else {
      if (formData.password !== formData.confirmPassword) {
        setMessage('Passwords do not match!')
        return
      }
      setMessage('Account created successfully! Redirecting...')
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)
    }
  }

  return (
    <main className="bg-background min-h-screen flex items-center justify-center py-12">
        <div className="w-full max-w-md mx-auto px-4">
          {/* Toggle Buttons */}
          <div className="flex gap-4 mb-8 justify-center">
            <button
              onClick={() => {
                setIsLogin(true)
                setMessage('')
              }}
              className={`px-8 py-3 font-bold rounded-lg transition transform ${
                isLogin
                  ? 'bg-orange-700 text-white scale-105 shadow-lg'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setMessage('')
              }}
              className={`px-8 py-3 font-bold rounded-lg transition transform ${
                !isLogin
                  ? 'bg-orange-700 text-white scale-105 shadow-lg'
                  : 'bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Container with Smooth Transition */}
          <div className="bg-card rounded-lg p-8 border border-border">
            {message && (
              <div className={`mb-6 p-4 rounded-lg text-center ${
                message.includes('successfully')
                  ? 'bg-green-600/20 text-green-400 border border-green-600'
                  : 'bg-red-600/20 text-red-400 border border-red-600'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition"
                  placeholder="Enter your email"
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
                  className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition"
                  placeholder="Enter your password"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required={!isLogin}
                    className="w-full bg-secondary border border-border rounded px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:border-accent transition"
                    placeholder="Confirm your password"
                  />
                </div>
              )}

              <div className="w-full">
                <button type="submit" className="w-full">
                  <ModernButton className="w-full">
                    {isLogin ? 'Login' : 'Create Account'}
                  </ModernButton>
                </button>
              </div>

              {isLogin && (
                <div className="text-center">
                  <a href="#" className="text-accent hover:text-orange-600 text-sm font-semibold">
                    Forgot Password?
                  </a>
                </div>
              )}
            </form>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground text-sm">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
    )
}
