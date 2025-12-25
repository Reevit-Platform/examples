import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { ReevitCheckout } from '@reevit/react'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/lib/products'
import { toast } from '@/components/ui/Toaster'

const countries = [
  { code: 'GH', name: 'Ghana', currency: 'GHS' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { code: 'KE', name: 'Kenya', currency: 'KES' },
]

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('GH')

  const selectedCountryData = countries.find((c) => c.code === selectedCountry)
  const publicKey = import.meta.env.VITE_REEVIT_PUBLIC_KEY || 'pk_test_demo'

  if (items.length === 0) {
    return (
      <main className="container mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-[var(--color-muted-foreground)] mb-8">
          Add some products before checking out
        </p>
        <Link to="/" className="btn btn-primary h-12 px-8 text-lg">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continue Shopping
        </Link>
      </main>
    )
  }

  const handlePaymentSuccess = (result: any) => {
    toast.success('Payment successful!')
    clearCart()
    navigate(`/payment/${result.reference || result.id}`)
  }

  const handlePaymentError = (error: any) => {
    toast.error(error.message || 'Payment failed')
  }

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="flex items-center gap-4 mb-12">
        <Link to="/cart" className="btn btn-ghost h-10 w-10 p-0">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-4xl font-bold">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Information */}
          <section className="glass p-8 rounded-3xl">
            <h2 className="text-2xl font-bold mb-6">Customer Information</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[var(--color-muted-foreground)] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="John Doe"
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--color-muted-foreground)] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-sm font-bold text-[var(--color-muted-foreground)] mb-2">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="input appearance-none cursor-pointer"
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code} className="bg-[#0a0a0f]">
                    {country.name} ({country.currency})
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* Reevit Info */}
          <div className="glass p-6 rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-[var(--color-accent)]" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">Secure Checkout</h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Your payment is securely processed through <span className="text-[var(--color-foreground)] font-semibold">Reevit's</span> unified payment platform. We automatically route to the best provider for your transaction.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary & Checkout */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="glass p-8 rounded-3xl">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            {/* Items */}
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-sm">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-[var(--color-border)] my-6" />

            {/* Totals */}
            <div className="space-y-3 mb-8">
              <div className="flex justify-between text-sm text-[var(--color-muted-foreground)]">
                <span>Subtotal</span>
                <span className="text-[var(--color-foreground)]">{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-[var(--color-muted-foreground)]">
                <span>Shipping</span>
                <span className="text-[var(--color-success)] font-bold">Free</span>
              </div>
              <div className="h-px bg-[var(--color-border)]" />
              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="text-xl font-extrabold text-[var(--color-accent)]">
                  {formatPrice(total, selectedCountryData?.currency)}
                </span>
              </div>
            </div>

            {/* Reevit Checkout Widget */}
            <ReevitCheckout
              publicKey={publicKey}
              amount={total}
              currency={selectedCountryData?.currency || 'GHS'}
              email={customerEmail}
              reference={`ORD-${Date.now()}`}
              metadata={{
                customer_name: customerName,
                order_items: items.map((i) => i.product.id).join(','),
              }}
              paymentMethods={['card', 'mobile_money']}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              theme={{
                primaryColor: '#6366f1',
                darkMode: true,
              }}
            >
              <button className="btn btn-primary w-full h-14 text-lg font-bold shadow-glow animate-pulse-glow">
                Pay {formatPrice(total, selectedCountryData?.currency)}
              </button>
            </ReevitCheckout>

            <p className="mt-6 text-xs text-center text-[var(--color-muted-foreground)]">
              🔒 100% Encrypted & Secure
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
