'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowLeft02Icon, SecurityCheckIcon } from '@hugeicons/core-free-icons'
import { useCart, type CartItem } from '@/lib/cart'
import { createPaymentIntent, type CheckoutIntentRequest } from '@/lib/checkout'
import { formatPrice } from '@/lib/products'
import { toast } from '@/components/Toaster'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const countries = [
  { code: 'GH', name: 'Ghana', currency: 'GHS' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { code: 'KE', name: 'Kenya', currency: 'KES' },
]

interface SubmittedOrder {
  idempotencyKey: string
  payload: CheckoutIntentRequest
  items: CartItem[]
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('GH')
  const [loading, setLoading] = useState(false)
  // One logical order keeps the same key when a network failure is retried.
  const [orderId] = useState(() => `ORD-${crypto.randomUUID()}`)
  const [submittedOrder, setSubmittedOrder] = useState<SubmittedOrder | null>(null)

  const selectedCountryData = countries.find((c) => c.code === selectedCountry)
  const displayItems = submittedOrder?.items ?? items
  const displayTotal = submittedOrder?.payload.amount ?? total
  const displayCurrency = submittedOrder?.payload.currency ?? selectedCountryData?.currency

  if (displayItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some products before checking out</p>
        <Link href="/">
          <Button size="lg">
            <HugeiconsIcon icon={ArrowLeft02Icon} className="mr-2 h-5 w-5" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  const handleCheckout = async () => {
    if (!submittedOrder && (!customerEmail || !customerName)) {
      toast.error('Please fill in your details')
      return
    }

    setLoading(true)
    try {
      // Retain the entire first request: an ambiguous failure may have already
      // created the payment, so a retry must not rebuild it from mutable inputs.
      const order = submittedOrder ?? {
        idempotencyKey: `checkout:${orderId}`,
        items: items.map((item) => ({ ...item, product: { ...item.product } })),
        payload: {
          amount: total,
          currency: selectedCountryData?.currency || 'GHS',
          method: 'card',
          country: selectedCountry,
          reference: orderId,
          metadata: {
            customer_name: customerName,
            customer_email: customerEmail,
            order_items: items.map((i) => i.product.id).join(','),
            org_id: process.env.NEXT_PUBLIC_REEVIT_ORG_ID || "your-organization-id",
            connection_id: process.env.NEXT_PUBLIC_REEVIT_CONNECTION_ID || "your-connection-id",
            payment_id: orderId
          },
        },
      }
      setSubmittedOrder(order)
      const data = await createPaymentIntent(order.payload, order.idempotencyKey)

      toast.success('Payment initiated via API!')
      clearCart()
      router.push(`/payment/${data.id || 'success'}`)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Checkout failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/cart">
          <Button variant="ghost" size="icon">
            <HugeiconsIcon icon={ArrowLeft02Icon} className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Checkout (Direct API)</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="checkout-name" className="text-sm font-medium text-muted-foreground mb-2 block">
                    Full Name
                  </label>
                  <Input
                    id="checkout-name"
                    type="text"
                    name="customerName"
                    autoComplete="name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    disabled={submittedOrder !== null}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-email" className="text-sm font-medium text-muted-foreground mb-2 block">
                    Email Address
                  </label>
                  <Input
                    id="checkout-email"
                    type="email"
                    name="customerEmail"
                    autoComplete="email"
                    spellCheck={false}
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    disabled={submittedOrder !== null}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="checkout-country" className="text-sm font-medium text-muted-foreground mb-2 block">
                  Country
                </label>
                <select
                  id="checkout-country"
                  name="country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  disabled={submittedOrder !== null}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.currency})
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-start gap-4 p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={SecurityCheckIcon} className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure Direct API Checkout</h3>
                <p className="text-sm text-muted-foreground">
                  Your payment is processed via direct <span className="text-primary font-medium">REST API</span> calls.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {displayItems.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(displayTotal, displayCurrency)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(displayTotal, displayCurrency)}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Processing…' : `${submittedOrder ? 'Retry' : 'Pay'} ${formatPrice(displayTotal, displayCurrency)}`}
              </Button>

              {submittedOrder && (
                <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
                  Your order details are locked. If the request fails, retry this
                  order to check its payment. Confirm its status before starting
                  another order.
                </p>
              )}

              <p className="text-xs text-center text-muted-foreground">
                🔒 100% Encrypted & Secure
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
