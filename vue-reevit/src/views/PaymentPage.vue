<template>
  <div class="container mx-auto px-4 py-24 text-center">
    <div class="max-w-lg mx-auto border rounded-lg p-8">
      <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
        ✓
      </div>
      <h1 class="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p class="text-muted-foreground mb-6">Your order has been confirmed.</p>
      <div class="p-4 bg-muted rounded-lg mb-8">
        <p class="text-sm text-muted-foreground">Payment Reference</p>
        <p class="font-mono text-primary">{{ id }}</p>
      </div>
      <RouterLink to="/">
        <button class="bg-primary text-primary-foreground px-6 py-2 rounded-md">
          Back to Shop
        </button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
</script>
