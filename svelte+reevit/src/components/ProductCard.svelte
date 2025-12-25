<script lang="ts">
  import { Star, Plus } from 'lucide-svelte'
  import { cart } from '$lib/cart.svelte'
  import { formatPrice, type Product } from '$lib/products'

  const { product } = $props<{ product: Product }>()

  function handleAddToCart() {
    cart.addItem(product)
  }
</script>

<div class="card group">
  <div class="relative aspect-square overflow-hidden bg-[var(--color-card)]">
    <img
      src={product.image}
      alt={product.name}
      class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
    <button
      onclick={handleAddToCart}
      class="absolute bottom-4 right-4 w-10 h-10 rounded-full gradient-accent flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-glow"
    >
      <Plus class="w-5 h-5 text-white" />
    </button>
  </div>

  <div class="p-5">
    <div class="flex items-center justify-between mb-2">
      <span class="badge text-[10px]">{product.category}</span>
      <div class="flex items-center gap-1 text-amber-400">
        <Star class="w-3 h-3 fill-current" />
        <span class="text-xs font-semibold">{product.rating}</span>
      </div>
    </div>

    <h3 class="font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
    <p class="text-sm text-[var(--color-muted-foreground)] line-clamp-2 mb-4">
      {product.description}
    </p>

    <div class="flex items-center justify-between">
      <span class="text-xl font-extrabold text-[var(--color-accent)]">
        {formatPrice(product.price, product.currency)}
      </span>
      <button onclick={handleAddToCart} class="btn btn-primary h-9 px-4 text-sm">
        Add to Cart
      </button>
    </div>
  </div>
</div>
