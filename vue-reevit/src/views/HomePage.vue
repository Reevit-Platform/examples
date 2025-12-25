<template>
  <div class="bg-background">
    <!-- Hero Section -->
    <section class="relative h-[500px] overflow-hidden">
      <div 
        class="absolute inset-0 bg-cover bg-center"
        style="background-image: url(https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1920&h=800&fit=crop)"
      />
      <div class="absolute inset-0 bg-black/30" />
      <div class="relative container mx-auto px-4 h-full flex items-center">
        <div class="max-w-xl text-white">
          <h1 class="text-5xl font-bold leading-tight mb-4">
            Stylish<br />
            And Durable Furniture<br />
            Collection
          </h1>
          <p class="text-lg text-white/80 mb-6">
            Discover our stylish and durable furniture collection, designed to elevate your space with elegance and lasting quality.
          </p>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <section class="container mx-auto px-4 py-12">
      <h2 class="text-2xl font-bold mb-8">Latest Products</h2>
      
      <!-- Product Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product" 
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { products } from '@/lib/products'
import ProductCard from '@/components/ProductCard.vue'
</script>
