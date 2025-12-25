'use client'

import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ArrowLeft02Icon, SecurityCheckIcon } from '@hugeicons/react'
import { ReevitCheckout } from '@reevit/react'
import { useCart } from '../lib/cart'
import { formatPrice } from '../lib/products'
import { toast } from '../components/Toaster'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Separator } from '../components/ui/separator'

const countries = [
  { code: 'GH', name: 'Ghana', currency: 'GHS' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { code: 'KE', name: 'Kenya', currency: 'KES' },
]

export const Route = createFileRoute('/checkout')({ component: CheckoutPage })

function CheckoutPage() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('GH')

  const selectedCountryData = countries.find((c) => c.code === selectedCountry)
  const publicKey = import.meta.env.VITE_REEVIT_PUBLIC_KEY || 'pk_test_demo'

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="text-8xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">Add some products before checking out</p>
        <Link to="/">
          <Button size="lg">
            <ArrowLeft02Icon className="mr-2 h-5 w-5" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  const handlePaymentSuccess = (result: { reference?: string; id?: string }) => {
    toast.success('Payment successful!')
    clearCart()
    navigate({ to: '/payment/$id', params: { id: result.reference || result.id || 'unknown' } })
  }

  const handlePaymentError = (error: { message?: string }) => {
    toast.error(error.message || 'Payment failed')
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/cart">
          <Button variant="ghost" size="icon">
            <ArrowLeft02Icon className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
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

          {/* Security Notice */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-start gap-4 p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <SecurityCheckIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure Checkout</h3>
                <p className="text-sm text-muted-foreground">
                  Your payment is securely processed through{' '}
                  <span className="text-primary font-medium">Reevit's</span> unified
                  payment platform. We automatically route to the best provider.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:sticky lg:top-24 h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
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

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(total, selectedCountryData?.currency)}
                  </span>
                </div>
              </div>

              {/* Reevit Checkout */}
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
                  primaryColor: '#ea580c',
                  darkMode: false,
                }}
              >
                <Button className="w-full" size="lg">
                  Pay {formatPrice(total, selectedCountryData?.currency)}
                </Button>
              </ReevitCheckout>

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
