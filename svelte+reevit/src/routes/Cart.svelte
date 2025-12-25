<script lang="ts">
  import { ArrowLeft, ArrowRight, Plus, Minus, Trash2 } from 'lucide-svelte'
  import { cart } from '$lib/cart.svelte'
  import { formatPrice } from '$lib/products'
</script>

{#if cart.items.length === 0}
  <main class="container mx-auto px-6 py-24 text-center">
    <div class="text-6xl mb-6">🛒</div>
    <h1 class="text-3xl font-bold mb-4">Your cart is empty</h1>
    <p class="text-[var(--color-muted-foreground)] mb-8">Add some products to get started</p>
    <a href="#/" class="btn btn-primary h-12 px-8 text-lg">
      <ArrowLeft class="w-5 h-5 mr-2" /> Continue Shopping
    </a>
  </main>
{:else}
  <main class="container mx-auto px-6 py-12">
    <div class="flex items-center gap-4 mb-12">
      <a href="#/" class="btn btn-ghost h-10 w-10 p-0">
        <ArrowLeft class="w-5 h-5" />
      </a>
      <h1 class="text-4xl font-bold">Shopping Cart</h1>
    </div>

    <div class="grid lg:grid-cols-3 gap-12">
      <div class="lg:col-span-2 space-y-4">
        {#each cart.items as item (item.product.id)}
          <div class="glass p-6 rounded-2xl flex gap-6">
            <div class="w-24 h-24 rounded-xl overflow-hidden shrink-0">
              <img src={item.product.image} alt={item.product.name} class="w-full h-full object-cover" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-bold text-lg mb-1">{item.product.name}</h3>
              <p class="text-sm text-[var(--color-muted-foreground)] line-clamp-1 mb-3">{item.product.description}</p>
              <div class="flex items-center gap-3">
                <button onclick={() => cart.updateQuantity(item.product.id, item.quantity - 1)} class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center">
                  <Minus class="w-4 h-4" />
                </button>
                <span class="font-bold w-8 text-center">{item.quantity}</span>
                <button onclick={() => cart.updateQuantity(item.product.id, item.quantity + 1)} class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center">
                  <Plus class="w-4 h-4" />
                </button>
              </div>
            </div>
            <div class="flex flex-col items-end justify-between">
              <span class="font-bold text-lg text-[var(--color-accent)]">
                {formatPrice(item.product.price * item.quantity, item.product.currency)}
              </span>
              <button onclick={() => cart.removeItem(item.product.id)} class="text-[var(--color-error)] hover:bg-[var(--color-error)]/10 p-2 rounded-lg">
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        {/each}
      </div>

      <div class="lg:sticky lg:top-24 h-fit">
        <div class="glass p-8 rounded-3xl">
          <h2 class="text-xl font-bold mb-6">Order Summary</h2>
          <div class="space-y-4 mb-6">
            <div class="flex justify-between text-[var(--color-muted-foreground)]">
              <span>Subtotal</span>
              <span class="text-[var(--color-foreground)] font-medium">{formatPrice(cart.total)}</span>
            </div>
            <div class="flex justify-between text-[var(--color-muted-foreground)]">
              <span>Shipping</span>
              <span class="text-[var(--color-success)] font-bold">Free</span>
            </div>
            <div class="h-px bg-[var(--color-border)]"></div>
            <div class="flex justify-between">
              <span class="text-lg font-bold">Total</span>
              <span class="text-2xl font-extrabold text-[var(--color-accent)]">{formatPrice(cart.total)}</span>
            </div>
          </div>
          <a href="#/checkout" class="btn btn-primary w-full h-14 text-lg font-bold shadow-glow">
            Proceed to Checkout <ArrowRight class="w-5 h-5 ml-2" />
          </a>
          <p class="mt-6 text-xs text-center text-[var(--color-muted-foreground)]">🔒 Secured by Reevit</p>
        </div>
      </div>
    </div>
  </main>
{/if}
