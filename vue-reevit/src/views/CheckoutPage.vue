<template>
  <div class="container mx-auto px-4 py-12">
    <div class="flex items-center gap-4 mb-8">
      <router-link to="/cart">
        <button class="p-2 hover:bg-accent rounded-full transition-colors">
          <ArrowLeft class="w-5 h-5" />
        </button>
      </router-link>
      <h1 class="text-3xl font-bold">Checkout</h1>
    </div>

    <div v-if="cartStore.items.length === 0" class="text-center py-24">
      <div class="text-8xl mb-6">🛒</div>
      <h2 class="text-3xl font-bold mb-4">Your cart is empty</h2>
      <p class="text-muted-foreground mb-8">Add some products before checking out</p>
      <router-link to="/">
        <button class="px-8 h-12 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center mx-auto">
          <ArrowLeft class="mr-2 h-5 w-5" />
          Continue Shopping
        </button>
      </router-link>
    </div>

    <div v-else class="grid lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 space-y-6">
        <!-- Customer Information -->
        <div class="bg-card border rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold mb-6">Customer Information</h2>
          <div class="space-y-4">
            <div class="grid sm:grid-cols-2 gap-4">
              <div>
                <label class="text-sm font-medium text-muted-foreground mb-2 block">Full Name</label>
                <input
                  v-model="customerName"
                  type="text"
                  placeholder="John Doe"
                  class="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label class="text-sm font-medium text-muted-foreground mb-2 block">Email Address</label>
                <input
                  v-model="customerEmail"
                  type="email"
                  placeholder="john@example.com"
                  class="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label class="text-sm font-medium text-muted-foreground mb-2 block">Country</label>
              <select
                v-model="selectedCountry"
                class="w-full h-10 px-3 rounded-md border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option v-for="country in countries" :key="country.code" :value="country.code">
                  {{ country.name }} ({{ country.currency }})
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Security Notice -->
        <div class="bg-primary/5 border border-primary/10 rounded-xl p-4 flex items-start gap-4">
          <div class="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <ShieldCheck class="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 class="font-semibold mb-1 text-sm">Secure Checkout</h3>
            <p class="text-xs text-muted-foreground leading-relaxed">
              Your payment is securely processed through <span class="text-primary font-medium">Reevit's</span> unified payment platform.
            </p>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:sticky lg:top-24 h-fit">
        <div class="bg-card border rounded-xl p-6 shadow-sm">
          <h2 class="text-xl font-bold mb-6">Order Summary</h2>
          
          <div class="space-y-4 mb-6">
            <div v-for="item in cartStore.items" :key="item.product.id" class="flex items-center gap-3">
              <img :src="item.product.image" :alt="item.product.name" class="w-12 h-12 rounded-lg object-cover" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ item.product.name }}</p>
                <p class="text-xs text-muted-foreground">Qty: {{ item.quantity }}</p>
              </div>
              <span class="text-sm font-semibold">{{ formatPrice(item.product.price * item.quantity) }}</span>
            </div>
          </div>

          <div class="border-t pt-4 space-y-2 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-muted-foreground">Subtotal</span>
              <span>{{ formatPrice(cartStore.total) }}</span>
            </div>
            <div class="flex justify-between text-sm font-medium">
              <span class="text-muted-foreground">Shipping</span>
              <span class="text-green-600">Free</span>
            </div>
            <div class="border-t pt-2 flex justify-between">
              <span class="font-bold">Total</span>
              <span class="text-xl font-bold text-primary">
                {{ formatPrice(cartStore.total, selectedCountryData?.currency) }}
              </span>
            </div>
          </div>

          <ReevitCheckout
            :publicKey="publicKey"
            :amount="cartStore.total"
            :currency="selectedCountryData?.currency || 'GHS'"
            :email="customerEmail"
            :reference="orderId"
            :metadata="{
              customer_name: customerName,
              order_items: cartStore.items.map(i => i.product.id).join(','),
              // IMPORTANT: These values are required for webhook routing
              // Get your org_id and connection_id from your Reevit dashboard
              org_id: import.meta.env.VITE_REEVIT_ORG_ID || 'your-organization-id',
              connection_id: import.meta.env.VITE_REEVIT_CONNECTION_ID || 'your-connection-id',
              // payment_id is typically the order/invoice ID from your system
              payment_id: orderId
            }"
            :paymentMethods="['card', 'mobile_money']"
            :theme="{ primaryColor: '#ea580c', darkMode: false }"
            @success="handleSuccess"
            @error="handleError"
          >
            <button class="w-full h-12 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity">
              Pay {{ formatPrice(cartStore.total, selectedCountryData?.currency) }}
            </button>
          </ReevitCheckout>

          <p class="text-xs text-center text-muted-foreground mt-4">
            🔒 100% Encrypted & Secure
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, ShieldCheck } from 'lucide-vue-next'
import { ReevitCheckout } from '@reevit/vue'
import '@reevit/vue/styles.css'
import { useCartStore } from '../stores/cart'
import { formatPrice } from '../lib/products'

const router = useRouter()
const cartStore = useCartStore()

const customerName = ref('')
const customerEmail = ref('')
const selectedCountry = ref('GH')
const orderId = `ORD-${Date.now()}`

const countries = [
  { code: 'GH', name: 'Ghana', currency: 'GHS' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { code: 'KE', name: 'Kenya', currency: 'KES' },
]

const selectedCountryData = computed(() => countries.find(c => c.code === selectedCountry.value))
const publicKey = import.meta.env.VITE_REEVIT_PUBLIC_KEY || 'pfk_test_demo'

function handleSuccess(result: any) {
  cartStore.clearCart()
  router.push(`/payment/${result.reference || result.id}`)
}

function handleError(error: any) {
  console.error('Payment failed:', error)
}
</script>
