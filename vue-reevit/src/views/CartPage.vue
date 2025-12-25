<template>
  <div v-if="cart.items.value.length === 0" class="container mx-auto px-4 py-24 text-center">
    <div class="text-8xl mb-6">🛒</div>
    <h1 class="text-3xl font-bold mb-4">Your cart is empty</h1>
    <p class="text-muted-foreground mb-8">Add some amazing products to get started</p>
    <RouterLink to="/">
      <button class="px-4 py-2 bg-primary text-primary-foreground rounded-md">
        Continue Shopping
      </button>
    </RouterLink>
  </div>

  <div v-else class="container mx-auto px-4 py-12">
    <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>
    
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div 
          v-for="item in cart.items.value" 
          :key="item.product.id"
          class="flex items-center gap-4 p-4 border rounded-lg"
        >
          <img :src="item.product.image" :alt="item.product.name" class="w-24 h-24 rounded-lg object-cover" />
          <div class="flex-1">
            <p class="text-xs text-muted-foreground uppercase">{{ item.product.category }}</p>
            <h3 class="font-semibold">{{ item.product.name }}</h3>
            <p class="text-primary font-bold">{{ formatPrice(item.product.price) }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="cart.updateQuantity(item.product.id, item.quantity - 1)" class="px-2 py-1 border rounded">-</button>
            <span class="w-8 text-center">{{ item.quantity }}</span>
            <button @click="cart.updateQuantity(item.product.id, item.quantity + 1)" class="px-2 py-1 border rounded">+</button>
          </div>
          <button @click="cart.removeItem(item.product.id)" class="text-destructive">🗑️</button>
        </div>
      </div>

      <!-- Summary -->
      <div class="border rounded-lg p-6 h-fit">
        <h2 class="text-xl font-bold mb-4">Order Summary</h2>
        <div class="space-y-2 mb-4">
          <div class="flex justify-between">
            <span>Subtotal</span>
            <span>{{ formatPrice(cart.total.value) }}</span>
          </div>
          <div class="flex justify-between">
            <span>Shipping</span>
            <span class="text-green-600">Free</span>
          </div>
        </div>
        <div class="border-t pt-4 mb-4">
          <div class="flex justify-between font-bold">
            <span>Total</span>
            <span class="text-primary text-xl">{{ formatPrice(cart.total.value) }}</span>
          </div>
        </div>
        <RouterLink to="/checkout" class="block">
          <button class="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md">
            Proceed to Checkout
          </button>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { formatPrice } from '@/lib/products'

const cart = useCartStore()
</script>
