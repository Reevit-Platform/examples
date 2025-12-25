import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/products'

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-[var(--color-muted-foreground)] mb-8">
          Add some products to get started
        </p>
        <Link to="/" className="btn btn-primary h-12 px-8 text-lg">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continue Shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/" className="btn btn-ghost h-10 w-10 p-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-4xl font-bold">Shopping Cart</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="glass p-6 rounded-2xl flex gap-6">
              {/* Image */}
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1">{item.product.name}</h3>
                <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-1 mb-3">
                  {item.product.description}
                </p>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-bold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Price & Remove */}
              <div className="flex flex-col items-end justify-between">
                <span className="font-bold text-lg text-[var(--color-accent)]">
                  {formatPrice(item.product.price * item.quantity, item.product.currency)}
                </span>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10 p-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-[var(--color-muted-foreground)]">
                <span>Subtotal</span>
                <span className="text-[var(--color-foreground)] font-medium">
                  {formatPrice(total)}
                </span>
              </div>
              <div className="flex justify-between text-[var(--color-muted-foreground)]">
                <span>Shipping</span>
                <span className="text-[var(--color-success)] font-bold">Free</span>
              </div>
              <div className="h-px bg-[var(--color-border)]" />
              <div className="flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-extrabold text-[var(--color-accent)]">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <Link
              to="/checkout"
              className="btn btn-primary w-full h-14 text-lg font-bold shadow-glow"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>

            <p className="mt-6 text-xs text-center text-[var(--color-muted-foreground)]">
              🔒 Secured by Reevit
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
