'use client'

import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { HugeiconsIcon } from '@hugeicons/react'
import { ShoppingCart01Icon, FavouriteIcon } from '@hugeicons/core-free-icons'
import type { Product } from '../lib/products'
import { formatPrice } from '../lib/products'
import { useCart } from '../lib/cart'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()

  return (
    <Card className="group overflow-hidden border-0 shadow-none bg-transparent p-0">
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <Badge
            variant={product.badge === 'Sale' ? 'destructive' : 'secondary'}
            className="absolute top-3 left-3 font-medium"
          >
            {product.badge}
          </Badge>
        )}
        <Button
          onClick={() => addItem(product)}
          size="icon"
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        >
          <HugeiconsIcon icon={ShoppingCart01Icon} className="h-4 w-4" />
        </Button>
      </div>
      <CardContent className="px-4 py-4">
        <div className='flex justify-between items-center'>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
              {product.category}
            </p>
            <h3 className="font-semibold text-foreground mb-2 line-clamp-1">
              {product.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 mb-2">
            <HugeiconsIcon icon={FavouriteIcon} className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-xs text-muted-foreground">{product.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
