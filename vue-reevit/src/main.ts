import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import './index.css'
import App from './App.vue'

// Import pages
import HomePage from './views/HomePage.vue'
import CartPage from './views/CartPage.vue'
import CheckoutPage from './views/CheckoutPage.vue'
import PaymentPage from './views/PaymentPage.vue'

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/cart', component: CartPage },
    { path: '/checkout', component: CheckoutPage },
    { path: '/payment/:id', component: PaymentPage },
  ],
})

// Create app
const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
