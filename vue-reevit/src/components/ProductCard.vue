<template>
  <div class="group overflow-hidden border-0 shadow-none bg-transparent p-0">
    <div class="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
      <img :src="product.image" :alt="product.name" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      <button @click="cart.addItem(product)" class="absolute bottom-3 right-3 bg-primary text-primary-foreground p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
        🛒
      </button>
    </div>
    <div class="px-4 py-4">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-xs text-muted-foreground uppercase">{{ product.category }}</p>
          <h3 class="font-semibold">{{ product.name }}</h3>
        </div>
        <div class="flex items-center gap-1">
          ⭐
          <span class="text-xs">{{ product.rating }}</span>
        </div>
      </div>
      <div class="flex items-center gap-2 mt-2">
        <span class="font-bold">{{ formatPrice(product.price) }}</span>
        <span v-if="product.originalPrice" class="text-sm text-muted-foreground line-through">
          {{ formatPrice(product.originalPrice) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPrice, type Product } from '@/lib/products'
import { useCartStore } from '@/stores/cart'

defineProps<{
  product: Product
}>()

const cart = useCartStore()
</script>
