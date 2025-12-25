<template>
  <header class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
    <div class="container mx-auto flex h-16 items-center justify-between px-4">
      <RouterLink to="/" class="text-xl font-bold">REEVIT STORE</RouterLink>
      
      <nav class="hidden md:flex items-center gap-8">
        <RouterLink to="/" class="text-sm font-medium hover:text-primary">Latest Products</RouterLink>
      </nav>
      
      <div class="flex items-center gap-2">
        <RouterLink to="/cart">
          <button class="relative p-2">
            🛒
            <span v-if="cart.itemCount.value > 0" class="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {{ cart.itemCount.value }}
            </span>
          </button>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()
</script>
