<script lang="ts">
  import { ArrowLeft, ShieldCheck } from 'lucide-svelte'
  import { ReevitCheckout } from '@reevit/svelte'
  import { cart } from '$lib/cart.svelte'
  import { formatPrice } from '$lib/products'

  let customerEmail = $state('')
  let customerName = $state('')
  let selectedCountry = $state('GH')

  const countries = [
    { code: 'GH', name: 'Ghana', currency: 'GHS' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN' },
    { code: 'KE', name: 'Kenya', currency: 'KES' },
  ]

  const selectedCountryData = $derived(countries.find((c) => c.code === selectedCountry))
  const publicKey = import.meta.env.VITE_REEVIT_PUBLIC_KEY || 'pk_test_demo'

  function handlePaymentSuccess(event: CustomEvent) {
    const result = event.detail
    cart.clearCart()
    window.location.hash = `/payment/${result.reference || result.id}`
  }

  function handlePaymentError(event: CustomEvent) {
    console.error('Payment failed:', event.detail)
  }
</script>

{#if cart.items.length === 0}
  <main class="container mx-auto px-6 py-24 text-center">
    <div class="text-6xl mb-6">🛒</div>
    <h1 class="text-3xl font-bold mb-4">Your cart is empty</h1>
    <p class="text-[var(--color-muted-foreground)] mb-8">Add some products before checking out</p>
    <a href="#/" class="btn btn-primary h-12 px-8 text-lg">
      <ArrowLeft class="w-5 h-5 mr-2" /> Continue Shopping
    </a>
  </main>
{:else}
  <main class="container mx-auto px-6 py-12">
    <div class="flex items-center gap-4 mb-12">
      <a href="#/cart" class="btn btn-ghost h-10 w-10 p-0">
        <ArrowLeft class="w-5 h-5" />
      </a>
      <h1 class="text-4xl font-bold">Checkout</h1>
    </div>

    <div class="grid lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2 space-y-8">
        <section class="glass p-8 rounded-3xl">
          <h2 class="text-2xl font-bold mb-6">Customer Information</h2>
          <div class="grid sm:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-bold text-[var(--color-muted-foreground)] mb-2">Full Name</label>
              <input bind:value={customerName} type="text" placeholder="John Doe" class="input" required />
            </div>
            <div>
              <label class="block text-sm font-bold text-[var(--color-muted-foreground)] mb-2">Email Address</label>
              <input bind:value={customerEmail} type="email" placeholder="john@example.com" class="input" required />
            </div>
          </div>
          <div class="mt-6">
            <label class="block text-sm font-bold text-[var(--color-muted-foreground)] mb-2">Country</label>
            <select bind:value={selectedCountry} class="input appearance-none cursor-pointer">
              {#each countries as country (country.code)}
                <option value={country.code} class="bg-[#0a0a0f]">{country.name} ({country.currency})</option>
              {/each}
            </select>
          </div>
        </section>

        <div class="glass p-6 rounded-2xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center shrink-0">
              <ShieldCheck class="w-6 h-6 text-[var(--color-accent)]" />
            </div>
            <div>
              <h3 class="text-lg font-bold mb-1">Secure Checkout</h3>
              <p class="text-sm text-[var(--color-muted-foreground)]">
                Your payment is securely processed through <span class="text-[var(--color-foreground)] font-semibold">Reevit's</span> unified payment platform.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:sticky lg:top-24 h-fit">
        <div class="glass p-8 rounded-3xl">
          <h2 class="text-xl font-bold mb-6">Order Summary</h2>
          <div class="space-y-4 mb-6">
            {#each cart.items as item (item.product.id)}
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                  <img src={item.product.image} alt={item.product.name} class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-sm line-clamp-1">{item.product.name}</p>
                  <p class="text-xs text-[var(--color-muted-foreground)]">Qty: {item.quantity}</p>
                </div>
                <span class="font-bold text-sm">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            {/each}
          </div>
          <div class="h-px bg-[var(--color-border)] my-6"></div>
          <div class="space-y-3 mb-8">
            <div class="flex justify-between text-sm text-[var(--color-muted-foreground)]">
              <span>Subtotal</span>
              <span class="text-[var(--color-foreground)]">{formatPrice(cart.total)}</span>
            </div>
            <div class="flex justify-between text-sm text-[var(--color-muted-foreground)]">
              <span>Shipping</span>
              <span class="text-[var(--color-success)] font-bold">Free</span>
            </div>
            <div class="h-px bg-[var(--color-border)]"></div>
            <div class="flex justify-between">
              <span class="font-bold">Total</span>
              <span class="text-xl font-extrabold text-[var(--color-accent)]">
                {formatPrice(cart.total, selectedCountryData?.currency)}
              </span>
            </div>
          </div>

          <ReevitCheckout
            publicKey={publicKey}
            amount={cart.total}
            currency={selectedCountryData?.currency || 'GHS'}
            email={customerEmail}
            reference={`ORD-${Date.now()}`}
            paymentMethods={['card', 'mobile_money']}
            theme={{ primaryColor: '#6366f1', darkMode: true }}
            on:success={handlePaymentSuccess}
            on:error={handlePaymentError}
          >
            <button class="btn btn-primary w-full h-14 text-lg font-bold shadow-glow animate-pulse-glow">
              Pay {formatPrice(cart.total, selectedCountryData?.currency)}
            </button>
          </ReevitCheckout>

          <p class="mt-6 text-xs text-center text-[var(--color-muted-foreground)]">🔒 100% Encrypted & Secure</p>
        </div>
      </div>
    </div>
  </main>
{/if}
