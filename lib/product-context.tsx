'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  badge: string | null;
  badgeColor?: 'orange' | 'red' | string;
  image: string;
  imagePublicId?: string; // For Cloudinary
  image2?: string;
  imagePublicId2?: string;
  image3?: string;
  imagePublicId3?: string;
  image4?: string;
  imagePublicId4?: string;
  availableColors?: string;
  relatedProducts?: string;
  productId?: string;
  status?: boolean;
  permissions?: string[];
  sales?: number;
  onSale?: boolean;
  saleDiscount?: number;
  quantity?: number;
  tags?: string;
  shipmentFee?: number;
  description?: string;
    collection?: string;
  }

const BAG_IMAGE = 'https://aodour.pk/cdn/shop/files/O1CN01cW8Q8j1uX7OoksflV__2670546046-0-cib_2340556f-c04a-421d-bf8d-43c529e6ec9e.jpg?v=1740306031&width=2048'

const initialProducts: Product[] = [
  {
    id: '1',
    name: 'Armand Nicolet A22 Leather Bag',
    price: 289,
    originalPrice: 399,
    rating: 5,
    reviews: 128,
    badge: 'SALE',
    image: BAG_IMAGE,
    productId: '#PRD-001',
    status: true,
    permissions: ['Create', 'Edit', 'Delete'],
    sales: 125,
    onSale: true,
    saleDiscount: 110,
    quantity: 50,
    shipmentFee: 200
  },
  {
    id: '2',
    name: 'Baume & Mercier Luxe Tote',
    price: 439,
    originalPrice: 549,
    rating: 5,
    reviews: 95,
    badge: null,
    image: BAG_IMAGE,
    productId: '#PRD-002',
    status: false,
    permissions: ['Read', 'Edit'],
    sales: 0,
    onSale: false,
    saleDiscount: 0,
    quantity: 0,
    shipmentFee: 0
  },
  {
    id: '3',
    name: 'Black Dial Red Accent Bag',
    price: 359,
    originalPrice: 449,
    rating: 5,
    reviews: 142,
    badge: 'HOT',
    badgeColor: 'red',
    image: BAG_IMAGE,
    productId: '#PRD-003',
    status: true,
    permissions: ['Create', 'Edit', 'Delete'],
    sales: 89,
    onSale: true,
    saleDiscount: 90,
    quantity: 120
  },
  {
    id: '4',
    name: 'Golden Line Shoulder Bag',
    price: 189,
    originalPrice: 289,
    rating: 5,
    reviews: 87,
    badge: 'SALE',
    image: BAG_IMAGE,
    productId: '#PRD-004',
    status: true,
    permissions: ['Read', 'Delete'],
    sales: 52,
    onSale: true,
    saleDiscount: 100,
    quantity: 30
  },
  {
    id: '5',
    name: 'Limited Edition Crossbody',
    price: 449,
    originalPrice: 599,
    rating: 5,
    reviews: 156,
    badge: null,
    image: BAG_IMAGE,
    productId: '#PRD-005',
    status: true,
    permissions: ['Create', 'Edit', 'Delete'],
    sales: 167,
    onSale: false,
    saleDiscount: 0,
    quantity: 85
  },
  {
    id: '6',
    name: 'Luxury Weekend Bag',
    price: 299,
    originalPrice: 399,
    rating: 5,
    reviews: 104,
    badge: 'HOT',
    badgeColor: 'red',
    image: BAG_IMAGE,
    productId: '#PRD-006',
    status: true,
    permissions: ['Create', 'Edit', 'Delete'],
    sales: 45,
    onSale: true,
    saleDiscount: 100,
    quantity: 15
  }
]

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updatedProduct: Product) => void;
  deleteProduct: (id: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
  maxPrice: number;
  setMaxPrice: (price: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5264';
  const API_URL = `${API_BASE_URL}/api/Products`;

  // Fetch products on mount
  React.useEffect(() => {
    fetch(API_URL)
      .then(async res => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`API Error (${res.status}): ${errorText.substring(0, 100)}...`);
        }
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(err => {
        console.warn('Product API unavailable, using fallback products:', err);
      });
  }, []);

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const id = Date.now().toString();
    const newProduct = { ...product, id };

    // Optimistic update
    setProducts(prev => [...prev, newProduct]);

    try {
      const resp = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });
      if (!resp.ok) throw new Error('Failed to add product');
    } catch (err) {
      console.error(err);
      // Rollback on error
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const updateProduct = async (id: string, updatedProduct: Product) => {
    const previousProducts = [...products];
    // Optimistic update
    setProducts(products.map(p => (p.id === id ? updatedProduct : p)));

    try {
      const resp = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct)
      });
      if (!resp.ok) throw new Error('Failed to update product');
    } catch (err) {
      console.error(err);
      setProducts(previousProducts);
    }
  };

  const deleteProduct = async (id: string) => {
    const previousProducts = [...products];
    // Optimistic update
    setProducts(products.filter(p => p.id !== id));

    try {
      const resp = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if (!resp.ok) throw new Error('Failed to delete product');
    } catch (err) {
      console.error(err);
      setProducts(previousProducts);
    }
  };

  return (
    <ProductContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct,
      selectedTags, setSelectedTags, maxPrice, setMaxPrice,
      searchQuery, setSearchQuery
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
