'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { Product } from './products'

export interface CartItem {
  product: Product
  quantity: number
}

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }

const CartContext = createContext<{
  items: CartItem[]
  total: number
  itemCount: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
} | null>(null)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.product.id === action.product.id)
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        }
      }
      return { items: [...state.items, { product: action.product, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.product.id !== action.productId) }
    case 'UPDATE_QUANTITY':
      return {
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: action.quantity }
            : i
        ).filter((i) => i.quantity > 0),
      }
    case 'CLEAR_CART':
      return { items: [] }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  const total = state.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        total,
        itemCount,
        addItem: (product) => dispatch({ type: 'ADD_ITEM', product }),
        removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', productId }),
        updateQuantity: (productId, quantity) =>
          dispatch({ type: 'UPDATE_QUANTITY', productId, quantity }),
        clearCart: () => dispatch({ type: 'CLEAR_CART' }),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
