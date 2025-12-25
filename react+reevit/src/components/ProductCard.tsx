import { Star, Plus } from 'lucide-react'
import { Product, formatPrice } from '@/lib/products'
import { useCart } from '@/contexts/CartContext'
import { toast } from '@/components/ui/Toaster'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product)
    toast.success(`${product.name} added to cart`)
  }

  return (
    <div className="card group">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[var(--color-card)]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Quick add button */}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-4 right-4 w-10 h-10 rounded-full gradient-accent flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-glow"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="badge text-[10px]">{product.category}</span>
          <div className="flex items-center gap-1 text-amber-400">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-semibold">{product.rating}</span>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>

        {/* Description */}
        <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2 mb-4">
          {product.description}
        </p>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-extrabold text-[var(--color-accent)]">
            {formatPrice(product.price, product.currency)}
          </span>
          <button
            onClick={handleAddToCart}
            className="btn btn-primary h-9 px-4 text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}
