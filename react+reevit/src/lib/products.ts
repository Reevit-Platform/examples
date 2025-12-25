export interface Product {
  id: string
  name: string
  description: string
  price: number // in smallest currency unit (pesewas/kobo)
  currency: string
  image: string
  category: string
  rating: number
}

export const products: Product[] = [
  {
    id: 'prod_001',
    name: 'Wireless Earbuds Pro',
    description: 'Premium wireless earbuds with active noise cancellation and 24-hour battery life.',
    price: 15000, // 150.00 GHS
    currency: 'GHS',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.8,
  },
  {
    id: 'prod_002',
    name: 'Smart Watch Series X',
    description: 'Advanced smartwatch with health monitoring, GPS, and 7-day battery life.',
    price: 35000, // 350.00 GHS
    currency: 'GHS',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.9,
  },
  {
    id: 'prod_003',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof speaker with 360° sound and 20-hour playtime.',
    price: 8500, // 85.00 GHS
    currency: 'GHS',
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.6,
  },
  {
    id: 'prod_004',
    name: 'USB-C Hub Pro',
    description: '7-in-1 USB-C hub with HDMI, USB 3.0, SD card reader, and PD charging.',
    price: 12000, // 120.00 GHS
    currency: 'GHS',
    image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=400&h=400&fit=crop',
    category: 'Accessories',
    rating: 4.5,
  },
  {
    id: 'prod_005',
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with hot-swappable switches and aluminum frame.',
    price: 22000, // 220.00 GHS
    currency: 'GHS',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=400&h=400&fit=crop',
    category: 'Accessories',
    rating: 4.7,
  },
  {
    id: 'prod_006',
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with precision tracking and long battery life.',
    price: 6500, // 65.00 GHS
    currency: 'GHS',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop',
    category: 'Accessories',
    rating: 4.4,
  },
]

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function formatPrice(amount: number, currency: string = 'GHS'): string {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100)
}
