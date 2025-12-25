// Product data and utilities

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  category: string
  rating: number
  description: string
  badge?: string
}

export const products: Product[] = [
  {
    id: 'prod_1',
    name: 'Edinburgh Dining Chair',
    price: 38900,
    originalPrice: 45400,
    image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop',
    category: 'Dining',
    rating: 4.8,
    description: 'Elegant dining chair with curved wooden frame',
    badge: 'Sale'
  },
  {
    id: 'prod_2',
    name: 'Aria Dining Chair',
    price: 44900,
    image: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400&h=400&fit=crop',
    category: 'Dining',
    rating: 4.9,
    description: 'Modern minimalist dining chair with fabric seat'
  },
  {
    id: 'prod_3',
    name: 'Sydney Armchair',
    price: 67500,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop',
    category: 'Living Room',
    rating: 4.7,
    description: 'Contemporary armchair with premium upholstery'
  },
  {
    id: 'prod_4',
    name: 'Onley Coffee Table',
    price: 48500,
    image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400&h=400&fit=crop',
    category: 'Living Room',
    rating: 4.6,
    description: 'Round wooden coffee table with minimalist design'
  },
  {
    id: 'prod_5',
    name: 'Lava Armchair',
    price: 75400,
    originalPrice: 89900,
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=400&fit=crop',
    category: 'Living Room',
    rating: 4.8,
    description: 'Sculptural armchair with curved silhouette',
    badge: 'Best Seller'
  },
  {
    id: 'prod_6',
    name: 'Rissle Modular Sofa',
    price: 149900,
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=400&fit=crop',
    category: 'Living Room',
    rating: 4.9,
    description: 'Modular curved sofa in premium boucle fabric'
  },
  {
    id: 'prod_7',
    name: 'Carpet Armchair',
    price: 52500,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop',
    category: 'Living Room',
    rating: 4.5,
    description: 'Comfortable armchair with textured fabric'
  },
  {
    id: 'prod_8',
    name: 'Theodore Armchair',
    price: 89400,
    originalPrice: 99400,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
    category: 'Living Room',
    rating: 4.8,
    description: 'Classic armchair with modern updates',
    badge: 'Member'
  },
]

export function formatPrice(amount: number, currency = 'GHS'): string {
  const symbols: Record<string, string> = {
    GHS: 'GH₵',
    NGN: '₦',
    KES: 'KSh',
    USD: '$',
  }

  return `${symbols[currency] || currency} ${(amount / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}
