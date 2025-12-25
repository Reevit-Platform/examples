<template>
  <div id="app">
    <AppHeader />
    <main class="min-h-screen">
      <RouterView />
    </main>
    <AppToaster />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppToaster from './components/AppToaster.vue'
</script>
