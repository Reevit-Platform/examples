import { products } from '@/lib/products'
import ProductCard from '@/components/ProductCard'

export default function Home() {
  return (
    <main className="container mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="inline-block mb-4">
          <span className="badge">Powered by Reevit</span>
        </div>
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          Premium <span className="gradient-accent bg-clip-text text-transparent">Electronics</span>
        </h1>
        <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
          Discover cutting-edge tech with seamless payments. Experience the future of African commerce with Reevit's unified payment platform.
        </p>
      </section>

      {/* Products Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <span className="text-sm text-[var(--color-muted-foreground)]">
            {products.length} products
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-24 grid md:grid-cols-3 gap-8">
        {[
          {
            title: 'Mobile Money',
            description: 'Pay with MTN, Vodafone, or AirtelTigo Mobile Money',
            icon: '📱',
          },
          {
            title: 'Card Payments',
            description: 'Secure Visa & Mastercard processing',
            icon: '💳',
          },
          {
            title: 'Smart Routing',
            description: 'Automatic provider selection for highest success rates',
            icon: '🚀',
          },
        ].map((feature) => (
          <div key={feature.title} className="glass p-6 rounded-2xl text-center">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="font-bold mb-2">{feature.title}</h3>
            <p className="text-sm text-[var(--color-muted-foreground)]">{feature.description}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
