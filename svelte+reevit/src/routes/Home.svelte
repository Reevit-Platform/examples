<script lang="ts">
  import { products } from '$lib/products'
  import ProductCard from '../components/ProductCard.svelte'
</script>

<main class="container mx-auto px-6 py-12">
  <section class="text-center mb-16">
    <div class="inline-block mb-4">
      <span class="badge">Powered by Reevit</span>
    </div>
    <h1 class="text-5xl font-extrabold mb-4 tracking-tight">
      Premium <span class="gradient-accent bg-clip-text text-transparent">Electronics</span>
    </h1>
    <p class="text-lg text-[var(--color-muted-foreground)] max-w-2xl mx-auto">
      Discover cutting-edge tech with seamless payments. Experience the future of African commerce with Reevit's unified payment platform.
    </p>
  </section>

  <section>
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold">Featured Products</h2>
      <span class="text-sm text-[var(--color-muted-foreground)]">{products.length} products</span>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each products as product (product.id)}
        <ProductCard {product} />
      {/each}
    </div>
  </section>

  <section class="mt-24 grid md:grid-cols-3 gap-8">
    <div class="glass p-6 rounded-2xl text-center">
      <div class="text-4xl mb-4">📱</div>
      <h3 class="font-bold mb-2">Mobile Money</h3>
      <p class="text-sm text-[var(--color-muted-foreground)]">Pay with MTN, Vodafone, or AirtelTigo Mobile Money</p>
    </div>
    <div class="glass p-6 rounded-2xl text-center">
      <div class="text-4xl mb-4">💳</div>
      <h3 class="font-bold mb-2">Card Payments</h3>
      <p class="text-sm text-[var(--color-muted-foreground)]">Secure Visa & Mastercard processing</p>
    </div>
    <div class="glass p-6 rounded-2xl text-center">
      <div class="text-4xl mb-4">🚀</div>
      <h3 class="font-bold mb-2">Smart Routing</h3>
      <p class="text-sm text-[var(--color-muted-foreground)]">Automatic provider selection for highest success rates</p>
    </div>
  </section>
</main>
