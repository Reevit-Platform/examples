'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { Settings02Icon, ArrowDown01Icon } from '@hugeicons/core-free-icons'
import { products } from '@/lib/products'
import { ProductCard } from '@/components/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

export default function HomePage() {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&h=800&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl text-white">
            <h1 className="text-5xl font-bold leading-tight mb-4">
              Stylish<br />
              And Durable Furniture<br />
              Collection
            </h1>
            <p className="text-lg text-white/80 mb-6">
              Discover our stylish and durable furniture collection, designed to elevate your space with elegance and lasting quality.
            </p>
            <div className="flex gap-4 text-sm">
              <div className="text-center">
                <p className="text-2xl font-bold">25+</p>
                <p className="text-white/70">Items</p>
              </div>
              <Separator orientation="vertical" className="h-12 bg-white/30" />
              <div className="text-center">
                <p className="text-2xl font-bold">10+</p>
                <p className="text-white/70">Outdoor</p>
              </div>
              <Separator orientation="vertical" className="h-12 bg-white/30" />
              <div className="text-center">
                <p className="text-2xl font-bold">15+</p>
                <p className="text-white/70">Living Room</p>
              </div>
              <Separator orientation="vertical" className="h-12 bg-white/30" />
              <div className="text-center">
                <p className="text-2xl font-bold">18+</p>
                <p className="text-white/70">Bedroom</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <Input
            placeholder="Search Product"
            className="max-w-xs"
          />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Category</span>
              <HugeiconsIcon icon={Settings02Icon} className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Color</span>
              <HugeiconsIcon icon={Settings02Icon} className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Price</span>
              <HugeiconsIcon icon={Settings02Icon} className="h-4 w-4 text-muted-foreground" />
            </div>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by: Best Sellers</span>
              <HugeiconsIcon icon={ArrowDown01Icon} className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-12">
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? 'default' : 'outline'}
              size="icon"
              className="w-10 h-10"
            >
              {page}
            </Button>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">A Little About Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">
            Taking cues from mid-century designs of furniture. All Green Street, our Treeton chairs remain a House bestseller.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Thoughtful Design</h3>
              <p className="text-sm text-muted-foreground">
                Choose quality furniture that transforms your living space and accompanies you day after day.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Everyday Value</h3>
              <p className="text-sm text-muted-foreground">
                Our collections set competitive market prices while maintaining exceptional quality.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Effortless Experience</h3>
              <p className="text-sm text-muted-foreground">
                We simplify everything from discovery to delivery, always making the process seamless.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Designed With The World in Mind</h3>
              <p className="text-sm text-muted-foreground">
                Every new collection incorporates sustainable materials and ethical production.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Shop The Look</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-8">
          Shop the look with the Theodore Armchair, where timeless comfort meets modern elegance, creating a stylish centerpiece for your living space.
        </p>
        <Button size="lg">
          Explore
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-2xl font-bold">REEVIT STORE</span>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <span>Latest Products</span>
              <span>Handpick</span>
              <span>Rugs</span>
              <span>Accessories</span>
              <span>Collection</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © Reevit Store. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}