'use client'

import { Link } from '@tanstack/react-router'
import { HugeiconsIcon } from '@hugeicons/react'
import { ShoppingCart01Icon, User02Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { useCart } from '../lib/cart'
import { Button } from './ui/button'

export function Header() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">REEVIT STORE</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Latest Products
          </Link>
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            Our Collection
          </span>
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            Artisans
          </span>
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            Customer Service
          </span>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <HugeiconsIcon icon={Search01Icon} className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <HugeiconsIcon icon={User02Icon} className="h-5 w-5" />
          </Button>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <HugeiconsIcon icon={ShoppingCart01Icon} className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
