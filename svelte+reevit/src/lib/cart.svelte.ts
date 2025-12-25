import type { Product } from './products'

export interface CartItem {
  product: Product
  quantity: number
}

const STORAGE_KEY = 'techshop_cart'

// Load initial state from localStorage
function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

// Svelte 5 runes for cart state
let items = $state<CartItem[]>(loadCart())

// Persist to localStorage on change
$effect.root(() => {
  $effect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  })
})

export const cart = {
  get items() { return items },
  get total() { return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) },
  get itemCount() { return items.reduce((sum, item) => sum + item.quantity, 0) },

  addItem(product: Product) {
    const existing = items.find((item) => item.product.id === product.id)
    if (existing) {
      existing.quantity++
    } else {
      items = [...items, { product, quantity: 1 }]
    }
  },

  removeItem(productId: string) {
    items = items.filter((item) => item.product.id !== productId)
  },

  updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId)
      return
    }
    const item = items.find((item) => item.product.id === productId)
    if (item) item.quantity = quantity
  },

  clearCart() {
    items = []
  }
}
