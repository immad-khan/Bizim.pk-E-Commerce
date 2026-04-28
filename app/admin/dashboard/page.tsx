'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { MessageSquare, CheckCircle, Edit, Trash2, Plus, X, Check, Filter, Search, LayoutDashboard, ShoppingCart, Users, FileText, Mail, Bell, Settings, LogOut, ChevronRight, Menu, ClipboardList, ChevronDown, Download, Upload, Loader2, Image as ImageIcon, Send, AlertTriangle } from 'lucide-react'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Link from 'next/link'
import React, { useState, useEffect, Fragment } from 'react'
import { useProductContext, Product } from '@/lib/product-context'

interface Subscriber {
  id: number
  email: string
  subscribedAt: string
}

interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string
  message: string
  isRead: boolean
  createdAt: string
}




interface SiteCustomization {
  heroVideoWebm: string;
  heroVideoMp4: string;
  heroImageLeft: string;
  heroImageLeftTitle: string;
  heroImageLeftSubtitle: string;
  heroImageLeftButtonText: string;
  heroImageTopRight: string;
  heroImageTopRightTitle: string;
  heroImageTopRightSubtitle: string;
  heroImageTopRightButtonText: string;
  heroImageBottomRight: string;
  heroImageBottomRightTitle: string;
  heroImageBottomRightSubtitle: string;
  heroImageBottomRightButtonText: string;
  collectionImage1: string;
  collectionImage2: string;
  collectionImage3: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  contactImage: string;
  aboutImage: string;
  aboutDescription: string;
  aboutYearsExperience: string;
  aboutProductsCurated: string;
  aboutHappyCustomers: string;
  aboutBrandPartners: string;
}

interface CustomerOrder {
  orderId: string
  placedAt: string
  status: string
  customer: {
    fullName: string; gender: string; city: string;
    fullAddress: string; email: string; phone: string; emergencyPhone: string
  }
  items: { id: string; name: string; price: number; quantity: number }[]
  subtotal: number; shipping: number; tax: number; total: number
}

import PakistanMap from './PakistanMap';

export default function AdminDashboard() {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5264'
  
  useEffect(() => {
    // Check authentication on client side only
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('bizim_admin_auth') === 'true'
      if (!isAuth) {
        window.location.href = '/admin/login'
      }
    }
  }, [])

  const { products, addProduct, updateProduct, deleteProduct } = useProductContext()
  const [activeTab, setActiveTab] = useState('overview')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  
  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm(`Are you sure you want to completely delete order ${orderId}? This cannot be undone.`)) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        setOrders(prev => prev.filter(o => o.orderId !== orderId))
      } else {
        alert('Failed to delete order.')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('An error occurred while deleting the order.')
    }
  }

  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [customizations, setCustomizations] = useState<SiteCustomization>({
    heroVideoWebm: '',
    heroVideoMp4: '',
    heroImageLeft: '',
    heroImageLeftTitle: '',
    heroImageLeftSubtitle: '',
    heroImageLeftButtonText: '',
    heroImageTopRight: '',
    heroImageTopRightTitle: '',
    heroImageTopRightSubtitle: '',
    heroImageTopRightButtonText: '',
    heroImageBottomRight: '',
    heroImageBottomRightTitle: '',
    heroImageBottomRightSubtitle: '',
    heroImageBottomRightButtonText: '',
    collectionImage1: '',
    collectionImage2: '',
    collectionImage3: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    contactImage: '',
    aboutImage: '',
    aboutDescription: '',
    aboutYearsExperience: '',
    aboutProductsCurated: '',
    aboutHappyCustomers: '',
    aboutBrandPartners: ''
  })
  const [isSavingCustomizations, setIsSavingCustomizations] = useState(false)


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/ContactMessages`);
        if (res.ok) setMessages(await res.json());
      } catch(e) {}
    }
    const fetchSubscribers = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/Subscribers`);
        if (res.ok) setSubscribers(await res.json());
      } catch(e) {}
    };
    fetchSubscribers();

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders`)
        if (response.ok) {
          const data = await response.json()
          // Map backend model to frontend CustomerOrder interface
          const mappedOrders: CustomerOrder[] = data.map((o: any) => ({
            orderId: o.orderId,
            placedAt: o.placedAt,
            status: o.status,
            customer: {
              fullName: o.customer?.fullName ?? o.customerFullName ?? '',
              gender: o.customer?.gender ?? o.customerGender ?? '',
              city: o.customer?.city ?? o.customerCity ?? '',
              fullAddress: o.customer?.fullAddress ?? o.customerFullAddress ?? '',
              email: o.customer?.email ?? o.customerEmail ?? '',
              phone: o.customer?.phone ?? o.customerPhone ?? '',
              emergencyPhone: o.customer?.emergencyPhone ?? o.customerEmergencyPhone ?? ''
            },
            items: (o.items ?? []).map((i: any) => ({
              id: i.productId,
              name: i.productName ?? i.name,
              price: Number(i.priceAtOrderTime ?? i.price ?? 0),
              quantity: i.quantity
            })),
            subtotal: Number(o.subtotal ?? 0),
            shipping: Number(o.shipping ?? 0),
            tax: Number(o.tax ?? 0),
            total: Number(o.total ?? 0)
          }))
          setOrders(mappedOrders)
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
    fetchMessages()

    const fetchCustomizations = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/Customizations`);
        if (res.ok) setCustomizations(await res.json());
      } catch(e) {}
    }
    fetchCustomizations()

  }, [])

  const handleMediaUpload = async (key: keyof SiteCustomization, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch(`${API_BASE_URL}/api/Customizations/upload`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setCustomizations(prev => ({ ...prev, [key]: data.url || data.Url }));
    } catch (err) {
      console.error('Error uploading media', err);
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCustomizationChange = (field: keyof SiteCustomization, value: string) => {
    setCustomizations(prev => ({ ...prev, [field]: value }))
  }

  const handleCustomizationSave = async () => {
    setIsSavingCustomizations(true)
    try {
      await fetch(`${API_BASE_URL}/api/Customizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customizations)
      })
      alert('Customizations saved successfully!')
    } catch(e) {
      alert('Failed to save customizations.')
    } finally {
      setIsSavingCustomizations(false)
    }
  }

  // Modals for editing/adding
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newProductForm, setNewProductForm] = useState<Partial<Product>>({
    name: '',
    productId: '',
    price: 0,
    originalPrice: 0,
    rating: 5,
    reviews: 0,
    badge: null,
    image: 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048',
    status: true,
    sales: 0,
    onSale: false,
    saleDiscount: 0,
    quantity: 0
  })

  // Calculate real-time stats
  const confirmedOrders = orders.filter(o => o.status === 'Completed')
  const totalSalesCount = confirmedOrders.length
  const totalRevenue = confirmedOrders.reduce((sum, o) => sum + o.total, 0)
  const totalItemsSold = confirmedOrders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0)

  // Real-time percentages
  const allOrdersCount = orders.length || 1;
  const completedSalesPercent = Math.round((totalSalesCount / allOrdersCount) * 100);
  
  const allRevenue = orders.reduce((sum, o) => sum + o.total, 0) || 1;
  const revenuePercent = Math.round((totalRevenue / allRevenue) * 100);
  
  const allItemsSold = orders.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0), 0) || 1;
  const itemsPercent = Math.round((totalItemsSold / allItemsSold) * 100);

  // Dynamic data for charts
  const kpiData = [
    { label: 'Total Sales (Orders)', value: totalSalesCount.toLocaleString(), percent: `${completedSalesPercent}%`, change: 'Γåæ Completion Rate', icon: ShoppingCart },
    { label: 'Total Revenue', value: `Rs ${Math.round(totalRevenue).toLocaleString()}`, percent: `${revenuePercent}%`, change: 'Γåæ Captured Rev', icon: FileText },
    { label: 'Total Items Sold', value: totalItemsSold.toLocaleString(), percent: `${itemsPercent}%`, change: 'Completion Rate', icon: Users },
    { label: 'Profit By Sale', value: 'Rs 0', percent: '0%', change: 'Not Tracked', icon: LayoutDashboard }
  ]

  // Real-time Traffic proxy (based on order placedAt days, using 15 visits per order as an estimate)
  const trafficData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({ name: day, value: 0 }))
  
  // Real-time sales statistics aggregated by month
  const currentYear = new Date().getFullYear()
  const salesStatData = [
    { name: 'Jan', sales: 0 }, { name: 'Feb', sales: 0 },
    { name: 'Mar', sales: 0 }, { name: 'Apr', sales: 0 },
    { name: 'May', sales: 0 }, { name: 'Jun', sales: 0 },
    { name: 'Jul', sales: 0 }, { name: 'Aug', sales: 0 },
    { name: 'Sep', sales: 0 }, { name: 'Oct', sales: 0 },
    { name: 'Nov', sales: 0 }, { name: 'Dec', sales: 0 }
  ]

  orders.forEach(o => {
    const d = new Date(o.placedAt)
    // Traffic processing (add 15 mock views per order on that day)
    const dayStr = d.toLocaleDateString('en-US', { weekday: 'short' })
    const tMatch = trafficData.find(t => t.name === dayStr)
    if (tMatch) tMatch.value += 15

    // Sales processing (sum revenue per month for completed orders)
    if (d.getFullYear() === currentYear && o.status === 'Completed') {
      salesStatData[d.getMonth()].sales += o.total
    }
  })

  // Prevent completely empty graphs if there are no orders yet
  if (orders.length === 0) {
    trafficData.forEach(t => t.value = Math.floor(Math.random() * 50) + 10)
  }

  // Profit/Expense info stays static as we don't track it yet in DB
  const profitData = [
    { name: 'Profit', value: 0 },
    { name: 'Uncalculated', value: 100 }
  ]
  const PIE_COLORS = ['#ea580c', '#1e293b']

  const locationCounts: Record<string, number> = {}
  orders.forEach(o => {
    let loc = o.customer?.city || 'Unknown'
    const locLower = loc.toLowerCase()
    if (locLower.includes('lahore') || locLower.includes('faisalabad') || locLower.includes('multan') || locLower.includes('punjab') || locLower.includes('rawalpindi')) loc = 'Punjab'
    else if (locLower.includes('karachi') || locLower.includes('hyderabad') || locLower.includes('sindh')) loc = 'Sindh'
    else if (locLower.includes('peshawar') || locLower.includes('kpk') || locLower.includes('mardan')) loc = 'KPK'
    else if (locLower.includes('islamabad')) loc = 'Islamabad'
    
    loc = loc.charAt(0).toUpperCase() + loc.slice(1)
    locationCounts[loc] = (locationCounts[loc] || 0) + 1
  })
  
  const topProvinces = Object.entries(locationCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map((ent, i) => {
      const positions = [
        { top: '40%', left: '30%' },
        { top: '45%', left: '60%' },
        { top: '30%', left: '45%' },
        { top: '55%', left: '40%' }
      ]
      return { name: ent[0], count: ent[1], ...positions[i] }
    })
    
  if (topProvinces.length === 0) {
      topProvinces.push({ name: 'Punjab', count: 0, top: '40%', left: '30%' })
  }

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime())
    .slice(0, 5)
    .map(o => ({
      id: `#${o.orderId.substring(0, 8).toUpperCase()}`,
      method: 'Checkout',
      type: 'Online Transaction',
      status: o.status,
      amount: `Rs ${o.total.toLocaleString()}`,
      date: new Date(o.placedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }))

  // Handlers
  const handleSaveEdit = () => {
    if (editingProduct) {
      updateProduct(editingProduct.id, editingProduct)
      setEditingProduct(null)
    }
  }

  const handleCreateProduct = () => {
    if (newProductForm.name && newProductForm.price !== undefined) {
      addProduct(newProductForm as Omit<Product, 'id'>)
      setIsAddModalOpen(false)
      // Reset form
      setNewProductForm({
        name: '', productId: '', description: '', price: 0, originalPrice: 0, rating: 5, reviews: 0, badge: null,
        image: 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048',
        imagePublicId: '',
        status: true, sales: 0, onSale: false, saleDiscount: 0, quantity: 0, shipmentFee: 0
      })
    }
  }

  const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const resp = await fetch(`${API_BASE_URL}/api/Products/upload`, {
        method: 'POST',
        body: formData
      })

      if (resp.ok) {
        const data = await resp.json()
        
        if (isEditing && editingProduct) {
          let variants = [];
          try { variants = JSON.parse(editingProduct.availableColors || "[]"); } catch { variants = [] }
          if(!Array.isArray(variants)) variants = [{ color: '', imageUrl: '', imagePublicId: '' }];
          if(variants[index]) { variants[index].imageUrl = data.url; variants[index].imagePublicId = data.publicId; }
          setEditingProduct({ ...editingProduct, availableColors: JSON.stringify(variants) })
        } else {
          let variants = [];
          try { variants = JSON.parse(newProductForm.availableColors || "[]"); } catch { variants = [] }
          if(!Array.isArray(variants)) variants = [{ color: '', imageUrl: '', imagePublicId: '' }];
          if(variants[index]) { variants[index].imageUrl = data.url; variants[index].imagePublicId = data.publicId; }
          setNewProductForm({ ...newProductForm, availableColors: JSON.stringify(variants) })
        }
      } else {
        const errorMsg = await resp.text()
        alert(`Upload failed: ${errorMsg}`)
      }
    } catch (err) {
      console.error(err)
      alert('Error uploading color image')
    } finally {
      setIsUploading(false)
    }
  }

  const parseColors = (colorString?: string) => {
    try {
        const parsed = JSON.parse(colorString || "[]");
        if(Array.isArray(parsed)) return parsed;
    } catch {
       if(colorString && colorString.length > 0 && !colorString.startsWith('[')) {
           return colorString.split(',').map((c: string) => ({ color: c.trim(), imageUrl: '', imagePublicId: '' }));
       }
    }
    return [];
  }

  const handleColorChange = (isEditing: boolean, index: number, field: string, value: string) => {
      const state = isEditing ? editingProduct : newProductForm;
      const setter = isEditing ? setEditingProduct : setNewProductForm;
      let colors = parseColors(state?.availableColors);
      if(colors[index]) {
          colors[index][field] = value;
      }
      setter({ ...state, availableColors: JSON.stringify(colors) } as any);
  }

  const addColorVariant = (isEditing: boolean) => {
      const state = isEditing ? editingProduct : newProductForm;
      const setter = isEditing ? setEditingProduct : setNewProductForm;
      let colors = parseColors(state?.availableColors);
      colors.push({ color: '', imageUrl: '', imagePublicId: '' });
      setter({ ...state, availableColors: JSON.stringify(colors) } as any);
  }

  const removeColorVariant = (isEditing: boolean, index: number) => {
      const state = isEditing ? editingProduct : newProductForm;
      const setter = isEditing ? setEditingProduct : setNewProductForm;
      let colors = parseColors(state?.availableColors);
      colors.splice(index, 1);
      setter({ ...state, availableColors: JSON.stringify(colors) } as any);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean, slot: number = 1) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const resp = await fetch(`${API_BASE_URL}/api/Products/upload`, {
        method: 'POST',
        body: formData
      })

      if (resp.ok) {
        const data = await resp.json()
        const imgKey = slot === 1 ? 'image' : `image${slot}`
        const pubKey = slot === 1 ? 'imagePublicId' : `imagePublicId${slot}`
        
        if (isEditing && editingProduct) {
          setEditingProduct({ ...editingProduct, [imgKey]: data.url, [pubKey]: data.publicId })
        } else {
          setNewProductForm({ ...newProductForm, [imgKey]: data.url, [pubKey]: data.publicId })
        }
      } else {
        const errorMsg = await resp.text()
        alert(`Upload failed: ${errorMsg}`)
      }
    } catch (err) {
      console.error(err)
      alert('Error uploading image')
    } finally {
      setIsUploading(false)
    }
  }

  const markMessageAsRead = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/ContactMessages/${id}/read`, { method: 'PUT' });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, isRead: true } : m));
      }
    } catch (e) {
      console.error('Failed to mark message as read', e);
    }
  }

  const derivedCustomers = Object.values(
    orders.filter(o => o.status === "Completed").reduce((acc, order) => {
      const phone = order.customer.phone;
      if (!acc[phone]) {
        acc[phone] = {
          name: order.customer.fullName,
          phone: order.customer.phone,
          email: order.customer.email,
          city: order.customer.city,
          
          totalOrders: 0,
          totalSpent: 0
        };
      }
      acc[phone].totalOrders += 1;
      acc[phone].totalSpent += order.total;
      return acc;
    }, {} as Record<string, { name: string, phone: string, email: string, city: string, totalOrders: number, totalSpent: number }>)
  ).sort((a, b) => b.totalSpent - a.totalSpent);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(o =>
      o.orderId === orderId ? { ...o, status: newStatus } : o
    )
    setOrders(updatedOrders)
    localStorage.setItem('bizim-orders', JSON.stringify(updatedOrders))
  }

  const downloadOrderPDF = (order: CustomerOrder) => {
    const doc = new jsPDF()

    // Header 
    doc.setFontSize(22)
    doc.setTextColor(234, 88, 12) // Orange color
    doc.text('BIZIM.PK - ORDER INVOICE', 105, 20, { align: 'center' })

    doc.setDrawColor(234, 88, 12)
    doc.setLineWidth(0.5)
    doc.line(20, 25, 190, 25)

    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Order ID: ${order.orderId}`, 20, 35)
    doc.text(`Date: ${new Date(order.placedAt).toLocaleString()}`, 20, 40)
    doc.text(`Status: ${order.status}`, 20, 45)

    // Customer Info 
    doc.setTextColor(0)
    doc.setFontSize(14)
    doc.text('Customer Information', 20, 60)
    doc.setFontSize(11)
    doc.text(`Name: ${order.customer.fullName}`, 20, 68)
    doc.text(`Phone: ${order.customer.phone}`, 20, 74)
    doc.text(`Email: ${order.customer.email}`, 20, 80)
    doc.text(`City: ${order.customer.city}`, 110, 68)
    doc.text(`Address: ${order.customer.fullAddress}`, 20, 86)

    // Items Table 
    const tableData = order.items.map(item => [
      item.name,
      `Rs ${item.price.toLocaleString()}`,
      item.quantity.toString(),
      `Rs ${(item.price * item.quantity).toLocaleString()}`
    ])

    autoTable(doc, {
      startY: 95,
      head: [['Product', 'Price', 'Qty', 'Total']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [234, 88, 12] },
      margin: { left: 20, right: 20 }
    })

    // Summary 
    const finalY = (doc as any).lastAutoTable.finalY + 15
    doc.setFontSize(11)
    doc.setTextColor(100)
    doc.text(`Subtotal:`, 140, finalY)
    doc.text(`Rs ${Math.round(order.subtotal).toLocaleString()}`, 170, finalY, { align: 'right' })

    doc.text(`Shipping:`, 140, finalY + 6)
    doc.text(`${order.shipping === 0 ? 'Free' : `Rs ${order.shipping.toLocaleString()}`}`, 170, finalY + 6, { align: 'right' })

    doc.text(`Tax:`, 140, finalY + 12)
    doc.text(`Rs ${Math.round(order.tax).toLocaleString()}`, 170, finalY + 12, { align: 'right' })

    doc.setFontSize(14)
    doc.setTextColor(234, 88, 12)
    doc.text(`Total:`, 140, finalY + 22)
    doc.text(`Rs ${Math.round(order.total).toLocaleString()}`, 170, finalY + 22, { align: 'right' })

    // Footer
    doc.setFontSize(9)
    doc.setTextColor(150)
    doc.text('Thank you for shopping with Bizim.pk!', 105, 280, { align: 'center' })

    doc.save(`Order_${order.orderId}.pdf`)
  }

  return (
    <div className="min-h-screen bg-[#060b14] text-slate-300 font-sans grid-bg">
      {/* Sci-Fi Grid Background CSS */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .grid-bg {
          background-image: 
            linear-gradient(rgba(234, 88, 12, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234, 88, 12, 0.05) 1px, transparent 1px);
          background-size: 30px 30px;
        }
        .neo-panel {
          background: rgba(13, 20, 36, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(234, 88, 12, 0.2);
          box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.5), inset 0 0 10px rgba(234, 88, 12, 0.05);
        }
        .neo-header {
          border-bottom: 1px solid rgba(234, 88, 12, 0.2);
          background: rgba(6, 11, 20, 0.9);
          backdrop-filter: blur(10px);
        }
        .neo-input {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(234, 88, 12, 0.3);
          color: #e2e8f0;
        }
        .neo-input:focus {
          outline: none;
          border-color: rgba(234, 88, 12, 0.8);
          box-shadow: 0 0 10px rgba(234, 88, 12, 0.2);
        }
        .neo-button {
          background: linear-gradient(135deg, rgba(234, 88, 12, 0.2) 0%, rgba(194, 65, 12, 0.4) 100%);
          border: 1px solid rgba(234, 88, 12, 0.4);
          transition: all 0.3s ease;
        }
        .neo-button:hover {
          background: linear-gradient(135deg, rgba(234, 88, 12, 0.4) 0%, rgba(194, 65, 12, 0.6) 100%);
          box-shadow: 0 0 15px rgba(234, 88, 12, 0.4);
          transform: translateY(-1px);
        }
        .neo-sidebar-item {
          transition: all 0.2s ease;
        }
        .neo-sidebar-item:hover, .neo-sidebar-item.active {
          background: linear-gradient(90deg, rgba(234, 88, 12, 0.15) 0%, transparent 100%);
          border-left: 3px solid #f97316;
          color: #fdba74;
        }
        .neo-progress-ring {
          stroke-dasharray: 100 100;
          stroke-dashoffset: 25;
          stroke-linecap: round;
        }
      `}} />

      {/* Header */}
      <header className="neo-header sticky top-0 z-40 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex-shrink-0 cursor-pointer">
            <img src="/logo.png" alt="Bizim.pk Admin" className="h-8 md:h-10 w-auto" />
          </Link>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-400 hover:text-orange-400 transition">
            <Menu className="w-5 h-5" />
          </button>
          <div className="relative hidden md:block w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search for Results..."
              className="neo-input w-full rounded-full py-1.5 pl-9 pr-4 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-orange-400 transition relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
          </button>
          <button className="text-slate-400 hover:text-orange-400 transition">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-orange-500/50 overflow-hidden ml-2 shadow-[0_0_8px_rgba(249,115,22,0.3)]">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Admin" className="w-full h-full" />
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden shrink-0 border-r border-orange-900/30 bg-[#060b14]/90 backdrop-blur-md`}>
          <div className="p-4 space-y-1 overflow-y-auto h-full scrollbar-hide">
            {[
              { id: 'overview', label: 'Dashboards', icon: LayoutDashboard },
              { id: 'products', label: 'Ecommerce', icon: ShoppingCart },
              { id: 'orders', label: 'Orders', icon: ClipboardList },
              { id: 'customers', label: 'CRM', icon: Users },
              { id: 'analytics', label: 'Analytics', icon: FileText },
              { id: 'messages', label: 'Messages', icon: Mail },
              { id: 'subscribers', label: 'Subscribers', icon: Send },
              { id: 'customizations', label: 'Customizations', icon: Settings }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`neo-sidebar-item w-full flex items-center gap-3 px-4 py-3 rounded-r-lg text-sm font-medium ${activeTab === item.id ? 'active' : 'text-slate-400 border-l-3 border-transparent'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.id === 'overview' && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
              </button>
            ))}

            <button
              onClick={() => {
                localStorage.removeItem('bizim_admin_auth')
                window.location.href = '/admin/login'
              }}
              className="w-full flex items-center gap-3 px-4 py-3 mt-8 rounded-r-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">

          {/* Dashboard Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpiData.map((kpi, i) => (
                  <div key={i} className="neo-panel p-5 rounded-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-orange-500/10 transition-all"></div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                      <div>
                        <div className="text-2xl font-bold text-white mb-1">{kpi.value}</div>
                        <div className="text-xs text-slate-400 font-medium">{kpi.label}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-orange-950/50 border border-orange-800/30 text-orange-400">
                        <kpi.icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs relative z-10">
                      <span className={kpi.change.includes('Γåæ') ? 'text-emerald-400' : 'text-rose-400'}>
                        {kpi.change}
                      </span>

                      {/* Mini Radial Chart Hack */}
                      <div className="relative w-8 h-8 flex items-center justify-center">
                        <svg className="w-8 h-8 -rotate-90">
                          <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(234, 88, 12, 0.2)" strokeWidth="3" />
                          <circle cx="16" cy="16" r="14" fill="none" stroke="#ea580c" strokeWidth="3"
                            strokeDasharray="88" strokeDashoffset={88 - (88 * parseInt(kpi.percent) / 100)}
                            className="transition-all duration-1000 ease-out" />
                        </svg>
                        <span className="absolute text-[8px] font-bold text-orange-300">{kpi.percent}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Traffic */}
                <div className="neo-panel p-5 rounded-xl lg:col-span-1">
                  <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse"></div>
                    Website Traffic
                  </h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trafficData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                          itemStyle={{ color: '#fed7aa' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#ea580c" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#ea580c', stroke: '#060b14', strokeWidth: 2 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Sales Stats */}
                <div className="neo-panel p-5 rounded-xl lg:col-span-1">
                  <h3 className="text-sm font-semibold text-slate-300 mb-6">Sales Statistics</h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesStatData}>
                        <defs>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ea580c" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ea580c" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorRefunds" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                        />
                        <Area type="monotone" dataKey="sales" stroke="#ea580c" fillOpacity={1} fill="url(#colorSales)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Bottom Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Map Placeholder */}
                <div className="neo-panel p-5 rounded-xl lg:col-span-1 relative flex flex-col">
                    <h3 className="text-sm font-semibold text-slate-300 mb-4 relative z-10">Top Province Sales</h3>
                    <div className="absolute inset-0 bg-[#0d1424]/80 rounded-xl" style={{ zIndex: -1 }}></div>
                    <div className="relative z-10 flex-1 flex items-center justify-center p-2">
                        {/* We use our newly created PakistanMap component here */}
                        <div className="w-full max-h-[300px] flex items-center justify-center">
                            <PakistanMap />
                        </div>
                    </div>
                </div>
                <div className="neo-panel p-5 rounded-xl lg:col-span-2 overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-slate-300">Recent Orders</h3>
                    <button className="text-xs text-orange-400 hover:text-orange-300">View All</button>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left border-collapse min-w-125">
                      <thead>
                        <tr className="border-b border-orange-900/30 text-[10px] uppercase tracking-wider text-slate-500 bg-orange-950/20">
                          <th className="p-3 font-medium rounded-tl-lg">Order ID</th>
                          <th className="p-3 font-medium">Payment Mode</th>
                          <th className="p-3 font-medium text-center">Status</th>
                          <th className="p-3 font-medium text-right rounded-tr-lg">Amount Paid</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order, i) => (
                          <tr key={i} className="border-b border-orange-900/10 hover:bg-orange-900/10 transition-colors text-xs">
                            <td className="p-3 font-mono text-slate-300">{order.id}</td>
                            <td className="p-3">
                              <div className="text-slate-200">{order.method}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{order.type}</div>
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] ${order.status === 'Completed' ? 'bg-orange-900/40 text-orange-400 border border-orange-700/50' :
                                'bg-indigo-900/40 text-indigo-400 border border-indigo-700/50'
                                }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <div className="text-slate-200 font-medium">{order.amount}</div>
                              <div className="text-[10px] text-slate-500 mt-0.5">{order.date}</div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Products / Ecommerce Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex max-sm:flex-col justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Products Overview</h2>
                  <p className="text-xs text-slate-400">Manage your store inventory and catalog</p>
                </div>
                <div className="flex gap-3">
                  <button className="neo-input px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-slate-800 transition">
                    <Filter className="w-4 h-4" /> Filter
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="neo-button px-4 py-2 rounded-lg text-sm text-orange-50 font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
              </div>

              <div className="neo-panel rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-orange-900/30 flex justify-between items-center bg-orange-950/20">
                  <div className="relative w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="neo-input w-full rounded-md py-1.5 pl-9 pr-4 text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Sort By:</span>
                    <select className="neo-input px-2 py-1 rounded text-orange-400 text-xs border-none outline-none cursor-pointer">
                      <option>Newest</option>
                      <option>Price: High to Low</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-200">
                    <thead>
                      <tr className="border-b border-orange-900/30 text-[10px] uppercase tracking-wider text-slate-400 bg-slate-900/50">
                        <th className="p-4 font-medium pl-6">Name</th>
                        <th className="p-4 font-medium">Product Id</th>
                        <th className="p-4 font-medium text-center">Stock</th>
                        <th className="p-4 font-medium">Original Price</th>
                        <th className="p-4 font-medium text-center">Sale Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b border-orange-900/10 hover:bg-orange-900/10 transition-colors text-xs group">
                          <td className="p-4 pl-6 flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-lg shrink-0">
                              {product.image.startsWith('http') ? <img src={product.image} className="w-full h-full object-cover" alt="" /> : product.image}
                            </div>
                            <span className="text-slate-200 font-medium line-clamp-1">{product.name}</span>
                          </td>
                          <td className="p-4 text-slate-400 font-mono text-[10px]">{product.productId || `#PRD-${product.id.substring(0, 4)}`}</td>

                          <td className="p-4 text-center">
                            {product.status !== false && product.quantity && product.quantity > 0 ? (
                              <div className="flex flex-col items-center">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-900/30 text-emerald-400 border border-emerald-800/50">
                                  Available
                                </span>
                                <span className="text-[9px] text-slate-400 mt-0.5">{product.quantity} in stock</span>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-rose-900/30 text-rose-400 border border-rose-800/50">
                                Out of Stock
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-slate-200">Rs {product.price}</td>

                          <td className="p-4 text-center relative">
                            {product.onSale ? (
                              <div className="flex flex-col items-center">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-orange-900/30 text-orange-400 border border-orange-800/50 w-full mb-0.5">
                                  ON SALE
                                </span>
                                <span className="text-[10px] text-emerald-400 font-bold">Rs {product.saleDiscount}</span>
                              </div>
                            ) : (
                              <span className="text-slate-500">-</span>
                            )}

                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditingProduct(product)}
                                className="p-1.5 rounded hover:bg-orange-900/50 text-orange-400 transition"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="p-1.5 rounded hover:bg-rose-900/50 text-rose-400 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 border-t border-orange-900/30 flex justify-between items-center text-xs text-slate-500 bg-orange-950/10">
                  <span>Showing {products.length} Entries</span>
                  <div className="flex gap-1">
                    <button className="px-2 py-1 hover:text-orange-400 disabled:opacity-50">Prev</button>
                    <button className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">1</button>
                    <button className="px-2 py-1 hover:text-orange-400 hover:bg-slate-800 rounded">2</button>
                    <button className="px-2 py-1 hover:text-orange-400">Next</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Customer Orders</h2>
                  <p className="text-xs text-slate-400">{orders.filter(o => o.status !== "Completed").length} active order(s)</p>
                </div>
              </div>

              {orders.filter(o => o.status !== "Completed").length === 0 ? (
                <div className="neo-panel rounded-xl p-12 text-center">
                  <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No orders placed yet</p>
                  <p className="text-slate-600 text-xs mt-1">Orders will appear here when customers checkout</p>
                </div>
              ) : (
                <div className="neo-panel rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-175">
                      <thead>
                        <tr className="border-b border-orange-900/30 text-[10px] uppercase tracking-wider text-slate-400 bg-slate-900/50">
                          <th className="p-4 font-medium">Order ID</th>
                          <th className="p-4 font-medium">Customer</th>
                          <th className="p-4 font-medium">City</th>
                          <th className="p-4 font-medium">Phone</th>
                          <th className="p-4 font-medium">Items</th>
                          <th className="p-4 font-medium text-right">Total</th>
                          <th className="p-4 font-medium text-center">Status</th>
                          <th className="p-4 font-medium"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.filter(o => o.status !== "Completed").map((order) => (
                          <React.Fragment key={order.orderId}>
                            <tr
                              className="border-b border-orange-900/10 hover:bg-orange-900/10 transition-colors text-xs cursor-pointer"
                              onClick={() => setExpandedOrder(expandedOrder === order.orderId ? null : order.orderId)}
                            >
                              <td className="p-4 font-mono text-orange-400">{order.orderId}</td>
                              <td className="p-4">
                                <div className="text-slate-200 font-medium">{order.customer.fullName}</div>
                                <div className="text-slate-500 text-[10px]">{order.customer.gender}</div>
                              </td>
                              <td className="p-4 text-slate-300">{order.customer.city}</td>
                              <td className="p-4 text-slate-300">{order.customer.phone}</td>
                              <td className="p-4 text-slate-400">{order.items.reduce((s, i) => s + i.quantity, 0)} item(s)</td>
                              <td className="p-4 text-right font-bold text-orange-400">Rs {Math.round(order.total).toLocaleString()}</td>
                              <td className="p-4 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] border 
                                  ${order.status === 'Completed' ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700/50' :
                                    order.status === 'On Working' ? 'bg-orange-900/40 text-orange-400 border-orange-700/50' :
                                      'bg-indigo-900/40 text-indigo-400 border-indigo-700/50'
                                  }`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="p-4">
                                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${expandedOrder === order.orderId ? 'rotate-180' : ''}`} />
                              </td>
                            </tr>
                            {expandedOrder === order.orderId && (
                              <tr className="border-b border-orange-900/10 bg-slate-900/60">
                                <td colSpan={8} className="p-5">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="text-[10px] font-semibold text-orange-400 uppercase tracking-widest mb-3">Customer Details</h4>
                                      <div className="space-y-2 text-xs">
                                        {[
                                          ['Full Name', order.customer.fullName],
                                          ['Gender', order.customer.gender],
                                          ['City', order.customer.city],
                                          ['Full Address', order.customer.fullAddress],
                                          ['Email', order.customer.email],
                                          ['Phone', order.customer.phone],
                                          ['Emergency Phone', order.customer.emergencyPhone],
                                          ['Placed At', new Date(order.placedAt).toLocaleString()],
                                        ].map(([label, val]) => (
                                          <div key={label} className="flex gap-3">
                                            <span className="text-slate-500 w-36 shrink-0">{label}</span>
                                            <span className="text-slate-200">{val}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="flex flex-col">
                                      <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-[10px] font-semibold text-orange-400 uppercase tracking-widest">Ordered Items</h4>
                                        <div className="flex gap-2">
                                          <button
                                            onClick={(e) => { e.stopPropagation(); downloadOrderPDF(order) }}
                                            className="text-[10px] flex items-center gap-1.5 px-2 py-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20 transition"
                                          >
                                            <Download className="w-3 h-3" /> Download PDF
                                          </button>
                                          <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteOrder(order.orderId) }}
                                            className="text-[10px] flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition"
                                          >
                                            <Trash2 className="w-3 h-3" /> Delete
                                          </button>
                                        </div>
                                      </div>
                                      <div className="space-y-2 text-xs flex-1">
                                        {order.items.map(item => (
                                          <div key={item.id} className="flex justify-between">
                                            <span className="text-slate-300">{item.name} ├ù {item.quantity}</span>
                                            <span className="text-orange-400 font-medium">Rs {(item.price * item.quantity).toLocaleString()}</span>
                                          </div>
                                        ))}
                                        <div className="border-t border-orange-900/30 pt-2 mt-2 space-y-1 text-[11px]">
                                          <div className="flex justify-between text-slate-400"><span>Subtotal</span><span>Rs {Math.round(order.subtotal).toLocaleString()}</span></div>
                                          <div className="flex justify-between text-slate-400"><span>Shipping</span><span>{order.shipping === 0 ? 'Free' : `Rs ${order.shipping}`}</span></div>
                                          <div className="flex justify-between text-slate-400"><span>Tax</span><span>Rs {Math.round(order.tax).toLocaleString()}</span></div>
                                          <div className="flex justify-between font-bold text-orange-300 text-xs pt-1"><span>Total</span><span>Rs {Math.round(order.total).toLocaleString()}</span></div>
                                        </div>
                                      </div>
                                      <div className="mt-6 pt-4 border-t border-orange-900/30">
                                        <h4 className="text-[10px] font-semibold text-orange-400 uppercase tracking-widest mb-3">Update Order Status</h4>
                                        <div className="flex gap-2">
                                          {['Pending', 'On Working', 'Completed'].map(status => (
                                            <button
                                              key={status}
                                              onClick={(e) => { e.stopPropagation(); updateOrderStatus(order.orderId, status) }}
                                              className={`flex-1 py-1.5 rounded text-[10px] font-medium transition ${order.status === status
                                                ? 'bg-orange-500 text-white shadow-[0_0_10px_rgba(234,88,12,0.4)]'
                                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                }`}
                                            >
                                              {status}
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Customers Tab */}
          {activeTab === "customers" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Customer Database</h2>
                  <p className="text-xs text-slate-400">{derivedCustomers.length} unique customer(s)</p>
                </div>
              </div>

              {derivedCustomers.length === 0 ? (
                <div className="neo-panel rounded-xl p-12 text-center">
                  <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No customers found</p>
                </div>
              ) : (
                <div className="neo-panel rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-175">
                      <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/50 text-[10px] uppercase tracking-wider text-slate-400">
                          <th className="p-4 font-semibold">Customer</th>
                          <th className="p-4 font-semibold hidden sm:table-cell">Contact</th>
                          <th className="p-4 font-semibold hidden md:table-cell">Location</th>
                          <th className="p-4 font-semibold text-center">Total Orders</th>
                          <th className="p-4 font-semibold text-right">Lifetime Value</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {derivedCustomers.map((c, i) => (
                          <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center font-bold text-indigo-400 border border-slate-700">
                                  {c.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-semibold text-white">{c.name}</div>
                                  <div className="text-xs text-slate-400 sm:hidden mt-0.5">{c.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 hidden sm:table-cell text-slate-300">
                              <div className="flex flex-col gap-1">
                                {c.phone && <div className="text-xs">{c.phone}</div>}
                                {c.email && <div className="text-xs text-slate-500">{c.email}</div>}
                              </div>
                            </td>
                            <td className="p-4 hidden md:table-cell text-slate-400 capitalize text-xs">
                              {c.city}
                            </td>
                            <td className="p-4 text-center text-slate-300">
                              <div className="inline-flex items-center justify-center bg-slate-800 rounded px-2 py-1 text-xs font-mono border border-slate-700">
                                {c.totalOrders}
                              </div>
                            </td>
                            <td className="p-4 text-right font-medium text-white">
                              Rs {c.totalSpent.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Subscribers Tab */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Newsletter Subscribers</h2>
                  <p className="text-xs text-slate-400">{subscribers.length} total subscriber(s)</p>
                </div>
              </div>

              {subscribers.length === 0 ? (
                <div className="neo-panel rounded-xl p-12 text-center">
                  <Send className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No subscribers yet</p>
                </div>
              ) : (
                <div className="neo-panel rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-175">
                      <thead>
                        <tr className="border-b border-orange-900/30 text-[10px] uppercase tracking-wider text-slate-400 bg-slate-900/50">
                          <th className="p-4 font-medium">Email</th>
                          <th className="p-4 font-medium text-right">Subscribed At</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm divide-y divide-slate-800">
                        {subscribers.map((sub, i) => (
                          <tr key={sub.id || i} className="group hover:bg-slate-800/30 transition-colors">
                            <td className="p-4 font-medium text-white">{sub.email}</td>
                            <td className="p-4 text-right text-slate-400 text-xs">
                              {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : 'Unknown'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          
          {/* Customizations Tab */}
          {activeTab === 'customizations' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center bg-[#1a1a1a] p-6 rounded-2xl shadow-sm border border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white">Site Customizations</h2>
                  <p className="text-slate-400 text-sm mt-1">Manage the hero videos and images displayed on the homepage.</p>
                </div>
                <button 
                  onClick={handleCustomizationSave}
                  disabled={isSavingCustomizations}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-sm shadow-orange-500/20"
                >
                  {isSavingCustomizations ? (
                     <><Loader2 className="h-5 w-5 animate-spin" /> Saving...</>
                  ) : (
                     <><Check className="h-5 w-5" /> Save Changes</>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="bg-[#1a1a1a] rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                  <div className="border-b border-slate-800 px-6 py-4 bg-[#111]">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                       Hero Videos
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">WebM Video (Primary) {isUploading && <Loader2 className="w-3 h-3 inline animate-spin" />}</label>
                        <input
                          type="file"
                          accept="video/webm"
                          onChange={(e) => handleMediaUpload('heroVideoWebm', e)}
                          className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                        />
                        {customizations.heroVideoWebm && <div className="mt-2 text-xs text-slate-400 break-all">{customizations.heroVideoWebm}</div>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">MP4 Video (Fallback) {isUploading && <Loader2 className="w-3 h-3 inline animate-spin" />}</label>
                        <input
                          type="file"
                          accept="video/mp4"
                          onChange={(e) => handleMediaUpload('heroVideoMp4', e)}
                          className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                        />
                        {customizations.heroVideoMp4 && <div className="mt-2 text-xs text-slate-400 break-all">{customizations.heroVideoMp4}</div>}
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-2xl shadow-sm border border-slate-800 overflow-hidden">
                  <div className="border-b border-slate-800 px-6 py-4 bg-[#111]">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                       Hero Images
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Hero Image (Left) {isUploading && <Loader2 className="w-3 h-3 inline animate-spin" />}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaUpload('heroImageLeft', e)}
                          className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                        />
                        {customizations.heroImageLeft && <img src={customizations.heroImageLeft} alt="Preview Left" className="mt-2 h-20 rounded shadow" />}

                        <div className="space-y-3 mt-4 border-l-2 border-orange-500/30 pl-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Left Title</label>
                            <input type="text" value={customizations.heroImageLeftTitle || ''} onChange={(e) => handleCustomizationChange('heroImageLeftTitle', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Left Subtitle</label>
                            <input type="text" value={customizations.heroImageLeftSubtitle || ''} onChange={(e) => handleCustomizationChange('heroImageLeftSubtitle', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Button Text</label>
                            <input type="text" value={customizations.heroImageLeftButtonText || ''} onChange={(e) => handleCustomizationChange('heroImageLeftButtonText', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                          </div>
                        </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Hero Image (Top Right) {isUploading && <Loader2 className="w-3 h-3 inline animate-spin" />}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaUpload('heroImageTopRight', e)}
                          className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                        />
                        {customizations.heroImageTopRight && <img src={customizations.heroImageTopRight} alt="Preview TR" className="mt-2 h-20 rounded shadow" />}

                        <div className="space-y-3 mt-4 border-l-2 border-orange-500/30 pl-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Top Right Title</label>
                            <input type="text" value={customizations.heroImageTopRightTitle || ''} onChange={(e) => handleCustomizationChange('heroImageTopRightTitle', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Button Text</label>
                            <input type="text" value={customizations.heroImageTopRightButtonText || ''} onChange={(e) => handleCustomizationChange('heroImageTopRightButtonText', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                          </div>
                        </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Hero Image (Bottom Right) {isUploading && <Loader2 className="w-3 h-3 inline animate-spin" />}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaUpload('heroImageBottomRight', e)}
                          className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                        />
                        {customizations.heroImageBottomRight && <img src={customizations.heroImageBottomRight} alt="Preview BR" className="mt-2 h-20 rounded shadow" />}

                        <div className="space-y-3 mt-4 border-l-2 border-orange-500/30 pl-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Bottom Right Title</label>
                            <input type="text" value={customizations.heroImageBottomRightTitle || ''} onChange={(e) => handleCustomizationChange('heroImageBottomRightTitle', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Subtitle</label>
                            <input type="text" value={customizations.heroImageBottomRightSubtitle || ''} onChange={(e) => handleCustomizationChange('heroImageBottomRightSubtitle', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                          </div>
                        </div>
                    </div>

                    {/* Collection Images */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Collection Image 1 (Women's) {isUploading && <Loader2 className="w-3 h-3 inline animate-spin" />}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaUpload('collectionImage1', e)}
                          className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                        />
                        {customizations.collectionImage1 && <img src={customizations.collectionImage1} alt="Preview C1" className="mt-2 h-20 rounded shadow" />}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Collection Image 2 (Smart Bags) {isUploading && <Loader2 className="w-3 h-3 inline animate-spin" />}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaUpload('collectionImage2', e)}
                          className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                        />
                        {customizations.collectionImage2 && <img src={customizations.collectionImage2} alt="Preview C2" className="mt-2 h-20 rounded shadow" />}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Collection Image 3 (Men's) {isUploading && <Loader2 className="w-3 h-3 inline animate-spin" />}</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleMediaUpload('collectionImage3', e)}
                          className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                        />
                        {customizations.collectionImage3 && <img src={customizations.collectionImage3} alt="Preview C3" className="mt-2 h-20 rounded shadow" />}
                    </div>

                    {/* Contacts Section */}
                    <div className="pt-8 border-t border-slate-800">
                      <h3 className="text-lg font-bold text-white mb-4">Contacts:</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                          <input type="text" value={customizations.contactEmail || ''} onChange={(e) => handleCustomizationChange('contactEmail', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">Phone Number</label>
                          <input type="text" value={customizations.contactPhone || ''} onChange={(e) => handleCustomizationChange('contactPhone', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">Office Location</label>
                          <input type="text" value={customizations.contactAddress || ''} onChange={(e) => handleCustomizationChange('contactAddress', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">Contact Image {isUploading && <Loader2 className="w-3 h-3 inline animate-spin" />}</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMediaUpload('contactImage', e)}
                            className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                          />
                          {customizations.contactImage && <img src={customizations.contactImage} alt="Contact Preview" className="mt-2 h-20 rounded shadow" />}
                        </div>
                      </div>
                    </div>

                    {/* About Section */}
                    <div className="pt-8 border-t border-slate-800">
                      <h3 className="text-lg font-bold text-white mb-4">About Us:</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-1">About Image {isUploading && <Loader2 className="w-3 h-3 inline animate-spin" />}</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleMediaUpload('aboutImage', e)}
                            className="w-full px-4 py-2 bg-[#222] text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                          />
                          {customizations.aboutImage && <img src={customizations.aboutImage} alt="About Preview" className="mt-2 h-20 rounded shadow" />}
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-400 mb-1">Description</label>
                          <textarea rows={5} value={customizations.aboutDescription || ''} onChange={(e) => handleCustomizationChange('aboutDescription', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Years of Experience</label>
                            <input type="text" value={customizations.aboutYearsExperience || ''} onChange={(e) => handleCustomizationChange('aboutYearsExperience', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Products Curated</label>
                            <input type="text" value={customizations.aboutProductsCurated || ''} onChange={(e) => handleCustomizationChange('aboutProductsCurated', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Happy Customers</label>
                            <input type="text" value={customizations.aboutHappyCustomers || ''} onChange={(e) => handleCustomizationChange('aboutHappyCustomers', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-400 mb-1">Brand Partners</label>
                            <input type="text" value={customizations.aboutBrandPartners || ''} onChange={(e) => handleCustomizationChange('aboutBrandPartners', e.target.value)} className="w-full px-3 py-1.5 bg-[#111] text-white border border-slate-800 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500/50" />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === "messages" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Messages Inbox</h2>
                  <p className="text-xs text-slate-400">{messages.filter(m => !m.isRead).length} unread message(s)</p>
                </div>
              </div>

              {messages.length === 0 ? (
                <div className="neo-panel rounded-xl p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No messages received yet</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`neo-panel rounded-xl p-5 border-l-4 transition-all ${!message.isRead ? "border-l-orange-500 bg-slate-800/60 shadow-[0_4px_20px_rgba(234,88,12,0.1)]" : "border-l-slate-700 bg-slate-900/40 opacity-75"}`}>
                      <div className="flex justify-between items-start gap-4 mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border ${!message.isRead ? "bg-orange-500/20 text-orange-500 border-orange-500/30" : "bg-slate-800 text-slate-500 border-slate-700"}`}>
                            {message.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className={`font-bold ${!message.isRead ? "text-white" : "text-slate-300"}`}>{message.name}</h4>
                            <div className="flex gap-3 text-xs mt-0.5">
                              <span className={!message.isRead ? "text-orange-400/80" : "text-slate-500"}>{message.email}</span>
                              {message.phone && <span className="text-slate-500 border-l border-slate-700 pl-3">{message.phone}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-slate-500 mb-2">
                            {new Date(message.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </div>
                          {!message.isRead && (
                            <button onClick={() => markMessageAsRead(message.id)} className="text-[10px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-500 border border-orange-500/20 px-2 py-1 flex items-center gap-1 rounded hover:bg-orange-500 hover:text-white transition-colors">
                              <CheckCircle className="w-3 h-3" /> Mark Read
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-slate-300 bg-slate-950 p-4 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed">
                        {message.message}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Edit Modal */}
          {editingProduct && (
            <div className="fixed inset-0 bg-[#060b14]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="neo-panel max-w-md w-full max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-[0_0_30px_rgba(234,88,12,0.15)] bg-slate-900 border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-orange-400 rounded-full"></span>
                    Edit Product
                  </h3>
                  <button onClick={() => setEditingProduct(null)} className="text-slate-500 hover:text-white transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Product Name</label>
                        <input
                          type="text"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Product ID</label>
                        <input
                          type="text"
                          value={editingProduct.productId || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, productId: e.target.value })}
                          className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                          placeholder="e.g. #PRD-001"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Description</label>
                        <textarea
                            value={editingProduct.description || ''}
                            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                            className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Tags</label>
                          <div className="flex flex-wrap gap-2 neo-input w-full rounded-lg px-3 py-2 text-sm bg-slate-900/50">
                            {['Leather', 'Female', 'For Laptop Bag', 'High School', 'University', 'Large', 'Medium', 'Small', 'XXL', 'Backpack', 'girls', 'boys', 'office', 'trips'].map(tag => {
                              const tList = (editingProduct.tags || '').split(',').filter(Boolean);
                              const isActive = tList.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => {
                                    const newTags = isActive ? tList.filter(t => t !== tag) : [...tList, tag];
                                    setEditingProduct({ ...editingProduct, tags: newTags.join(',') });
                                  }}
                                  className={`px-2 py-1 rounded-md text-xs transition-colors ${isActive ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                >
                                  {tag}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Price (Rs)</label>
                      <input
                        type="number"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                        className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-2 mt-2">
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Product Images (Up to 4)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map(slot => {
                          const imgKey = slot === 1 ? 'image' : `image${slot}`;
                          const currentImg = (editingProduct as any)[imgKey];
                          return (
                            <div key={slot} className="flex gap-2 items-center">
                              <div className="relative flex-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, true, slot)}
                                  className="hidden"
                                  id={`edit-image-upload-${slot}`}
                                />
                                <label
                                  htmlFor={`edit-image-upload-${slot}`}
                                  className="neo-input w-full rounded-lg px-3 py-1.5 text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800 transition"
                                >
                                  {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                  {currentImg ? `Change Image ${slot}` : `Upload Image ${slot}`}
                                </label>
                              </div>
                              {currentImg && (
                                <div className="w-8 h-8 rounded shrink-0 overflow-hidden border border-orange-500/30">
                                  <img src={currentImg} className="w-full h-full object-cover" alt="prev" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="col-span-2 flex flex-col gap-1.5 mt-2">
                       <div className="flex justify-between items-center">
                         <label className="block text-xs text-orange-400 uppercase tracking-wider">Color Variants & Images</label>
                         <button type="button" onClick={() => addColorVariant(true)} className="text-xs text-orange-400 hover:text-orange-300 px-2 py-0.5 rounded bg-orange-500/10">+ Add Variant</button>
                       </div>
                       
                       <div className="flex flex-col gap-2">
                       {parseColors(editingProduct.availableColors).map((colorObj: any, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center bg-[#1a1a1a] p-2 rounded-lg border border-white/5">
                             <input type="text" value={colorObj.color} onChange={(e) => handleColorChange(true, idx, 'color', e.target.value)} className="neo-input flex-1 rounded-lg px-2 py-1.5 text-xs text-white" placeholder="Color name..." />
                             
                             {colorObj.imageUrl ? (
                                <img src={colorObj.imageUrl} alt="Variant" className="w-8 h-8 rounded object-cover" />
                             ) : (
                                <div className="w-8 h-8 rounded bg-black/50 border border-white/10 flex items-center justify-center text-[10px] text-white/30">Img</div>
                             )}

                             <label className="cursor-pointer text-xs bg-orange-500/20 text-orange-400 px-2 py-1.5 rounded hover:bg-orange-500/30 whitespace-nowrap">
                                Upload
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleColorImageUpload(e, true, idx)} />
                             </label>

                             <button type="button" onClick={() => removeColorVariant(true, idx)} className="text-rose-500 hover:bg-rose-500/20 p-1 rounded">
                                <X className="w-3.5 h-3.5" />
                             </button>
                          </div>
                       ))}
                       </div>
                       <label className="block text-xs text-orange-400 uppercase tracking-wider mt-1">Related Product Names (For colors)</label>
                       <input
                         type="text"
                         value={editingProduct.relatedProducts || ''}
                         onChange={(e) => setEditingProduct({ ...editingProduct, relatedProducts: e.target.value })}
                         className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                         placeholder="e.g. Red Handbag, Blue Handbag"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-orange-900/30 pt-4 mt-2">
                    <div className="col-span-1">
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Quantity</label>
                      <input
                        type="number"
                        value={editingProduct.quantity || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, quantity: Number(e.target.value) })}
                        className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="col-span-1 border-l border-orange-900/30 pl-4">
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">On Sale</label>
                      <select
                        value={editingProduct.onSale ? 'true' : 'false'}
                        onChange={(e) => setEditingProduct({ ...editingProduct, onSale: e.target.value === 'true' })}
                        className="neo-input w-full rounded-lg px-3 py-2 text-sm cursor-pointer"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Sale Price (Rs)</label>
                      <input
                        type="number"
                        disabled={!editingProduct.onSale}
                        value={editingProduct.saleDiscount || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, saleDiscount: Number(e.target.value) })}
                        className="neo-input w-full rounded-lg px-3 py-2 text-sm disabled:opacity-50"                      />                    </div>                  </div>                  <div className="grid grid-cols-1 border-t border-orange-900/30 pt-4 mt-2"><div><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Collection</label><select value={isAddModalOpen ? (newProductForm.collection || "") : (editingProduct?.collection || "")} onChange={(e) => { if(isAddModalOpen){ setNewProductForm({...newProductForm, collection: e.target.value}); } else if(editingProduct) { setEditingProduct({...editingProduct, collection: e.target.value}); } }} className="neo-input w-full rounded-lg px-3 py-2 text-sm bg-[#111] text-white"><option value="">None</option><option value="mens">Mens Collection</option><option value="womens">Womens Collection</option><option value="smart-bags">Smart Bags</option></select></div></div><div className="grid grid-cols-1 border-t border-orange-900/30 pt-4 mt-2"><div><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label>                      <input                        type="number"                        value={editingProduct.shipmentFee || 0}                        onChange={(e) => setEditingProduct({ ...editingProduct, shipmentFee: Number(e.target.value) })}                        className="neo-input w-full rounded-lg px-3 py-2 text-sm"                        placeholder="0 for Free Shipping"                      />                    </div>                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleSaveEdit}
                      className="neo-button flex-1 py-2 rounded-lg text-sm text-white font-medium flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Add Modal */}
          {isAddModalOpen && (
            <div className="fixed inset-0 bg-[#060b14]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="neo-panel max-w-md w-full rounded-xl p-6 shadow-[0_0_30px_rgba(234,88,12,0.15)] bg-slate-900 border border-slate-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-orange-400 rounded-full"></span>
                    Add New Product
                  </h3>
                  <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 hover:text-white transition">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Product Name</label>
                    <input
                      type="text"
                      value={newProductForm.name}
                      onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                      className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Product ID</label>
                    <input
                      type="text"
                      value={newProductForm.productId || ''}
                      onChange={(e) => setNewProductForm({ ...newProductForm, productId: e.target.value })}
                      className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                      placeholder="e.g. #PRD-001"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Price (Rs)</label>
                      <input
                        type="number"
                        value={newProductForm.price}
                        onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                        className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="col-span-2 mt-2">
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Product Images (Up to 4)</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2, 3, 4].map(slot => {
                          const imgKey = slot === 1 ? 'image' : `image${slot}`;
                          const currentImg = (newProductForm as any)[imgKey];
                          return (
                            <div key={slot} className="flex gap-2 items-center">
                              <div className="relative flex-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => handleImageUpload(e, false, slot)}
                                  className="hidden"
                                  id={`add-image-upload-${slot}`}
                                />
                                <label
                                  htmlFor={`add-image-upload-${slot}`}
                                  className="neo-input w-full rounded-lg px-3 py-1.5 text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-800 transition"
                                >
                                  {isUploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                  {currentImg ? `Change Image ${slot}` : `Upload Image ${slot}`}
                                </label>
                              </div>
                              {currentImg && (
                                <div className="w-8 h-8 rounded shrink-0 overflow-hidden border border-orange-500/30">
                                  <img src={currentImg} className="w-full h-full object-cover" alt="prev" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="col-span-2 flex flex-col gap-1.5 mt-2">
                       <div className="flex justify-between items-center">
                         <label className="block text-xs text-orange-400 uppercase tracking-wider">Color Variants & Images</label>
                         <button type="button" onClick={() => addColorVariant(false)} className="text-xs text-orange-400 hover:text-orange-300 px-2 py-0.5 rounded bg-orange-500/10">+ Add Variant</button>
                       </div>
                       
                       <div className="flex flex-col gap-2">
                       {parseColors(newProductForm.availableColors).map((colorObj: any, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center bg-[#1a1a1a] p-2 rounded-lg border border-white/5">
                             <input type="text" value={colorObj.color} onChange={(e) => handleColorChange(false, idx, 'color', e.target.value)} className="neo-input flex-1 rounded-lg px-2 py-1.5 text-xs text-white" placeholder="Color name..." />
                             
                             {colorObj.imageUrl ? (
                                <img src={colorObj.imageUrl} alt="Variant" className="w-8 h-8 rounded object-cover" />
                             ) : (
                                <div className="w-8 h-8 rounded bg-black/50 border border-white/10 flex items-center justify-center text-[10px] text-white/30">Img</div>
                             )}

                             <label className="cursor-pointer text-xs bg-orange-500/20 text-orange-400 px-2 py-1.5 rounded hover:bg-orange-500/30 whitespace-nowrap">
                                Upload
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleColorImageUpload(e, false, idx)} />
                             </label>

                             <button type="button" onClick={() => removeColorVariant(false, idx)} className="text-rose-500 hover:bg-rose-500/20 p-1 rounded">
                                <X className="w-3.5 h-3.5" />
                             </button>
                          </div>
                       ))}
                       </div>
                       <label className="block text-xs text-orange-400 uppercase tracking-wider mt-1">Related Product Names (For colors)</label>
                       <input
                         type="text"
                         value={newProductForm.relatedProducts || ''}
                         onChange={(e) => setNewProductForm({ ...newProductForm, relatedProducts: e.target.value })}
                         className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                         placeholder="e.g. Red Handbag, Blue Handbag"
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-orange-900/30 pt-4 mt-2">
                    <div className="col-span-1">
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Quantity</label>
                      <input
                        type="number"
                        value={newProductForm.quantity || 0}
                        onChange={(e) => setNewProductForm({ ...newProductForm, quantity: Number(e.target.value) })}
                        className="neo-input w-full rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="col-span-1 border-l border-orange-900/30 pl-4">
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">On Sale</label>
                      <select
                        value={newProductForm.onSale ? 'true' : 'false'}
                        onChange={(e) => setNewProductForm({ ...newProductForm, onSale: e.target.value === 'true' })}
                        className="neo-input w-full rounded-lg px-3 py-2 text-sm cursor-pointer"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Sale Price (Rs)</label>
                      <input
                        type="number"
                        disabled={!newProductForm.onSale}
                        value={newProductForm.saleDiscount || 0}
                        onChange={(e) => setNewProductForm({ ...newProductForm, saleDiscount: Number(e.target.value) })}
                        className="neo-input w-full rounded-lg px-3 py-2 text-sm disabled:opacity-50"                      />                    </div>                  </div>                  <div className="grid grid-cols-1 border-t border-orange-900/30 pt-4 mt-2"><div><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Collection</label><select value={isAddModalOpen ? (newProductForm.collection || "") : (editingProduct?.collection || "")} onChange={(e) => { if(isAddModalOpen){ setNewProductForm({...newProductForm, collection: e.target.value}); } else if(editingProduct) { setEditingProduct({...editingProduct, collection: e.target.value}); } }} className="neo-input w-full rounded-lg px-3 py-2 text-sm bg-[#111] text-white"><option value="">None</option><option value="mens">Mens Collection</option><option value="womens">Womens Collection</option><option value="smart-bags">Smart Bags</option></select></div></div><div className="grid grid-cols-1 border-t border-orange-900/30 pt-4 mt-2"><div><label className="block text-xs text-orange-400 mb-1.5 uppercase tracking-wider">Shipment Fee (Rs)</label>                      <input                        type="number"                        value={newProductForm.shipmentFee || 0}                        onChange={(e) => setNewProductForm({ ...newProductForm, shipmentFee: Number(e.target.value) })}                        className="neo-input w-full rounded-lg px-3 py-2 text-sm"                        placeholder="0 for Free Shipping"                      />                    </div>                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      onClick={handleCreateProduct}
                      className="neo-button flex-1 py-2 rounded-lg text-sm text-white font-medium flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Create Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

