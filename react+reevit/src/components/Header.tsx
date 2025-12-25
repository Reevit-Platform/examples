import { Link } from 'react-router-dom'
import { ShoppingCart, Zap } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

export default function Header() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 glass">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shadow-glow">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-xl">
            Tech<span className="text-[var(--color-accent)]">Shop</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors"
          >
            Products
          </Link>
          <Link to="/cart" className="relative group">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all group-hover:bg-white/10">
              <ShoppingCart className="w-5 h-5" />
            </div>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-accent text-[10px] font-bold flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
