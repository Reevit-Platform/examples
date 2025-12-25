<script lang="ts">
  import { ShoppingCart, Zap } from 'lucide-svelte'
  import { cart } from '$lib/cart.svelte'
</script>

<header class="sticky top-0 z-50 glass">
  <div class="container mx-auto px-6 h-16 flex items-center justify-between">
    <a href="#/" class="flex items-center gap-2 group">
      <div class="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center shadow-glow">
        <Zap class="w-4 h-4 text-white" />
      </div>
      <span class="font-bold text-xl">
        Tech<span class="text-[var(--color-accent)]">Shop</span>
      </span>
    </a>

    <nav class="flex items-center gap-6">
      <a href="#/" class="text-sm font-medium text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors">
        Products
      </a>
      <a href="#/cart" class="relative group">
        <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center transition-all group-hover:bg-white/10">
          <ShoppingCart class="w-5 h-5" />
        </div>
        {#if cart.itemCount > 0}
          <span class="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-accent text-[10px] font-bold flex items-center justify-center">
            {cart.itemCount}
          </span>
        {/if}
      </a>
    </nav>
  </div>
</header>
