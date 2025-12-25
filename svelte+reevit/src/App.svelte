<script lang="ts">
  import Header from './components/Header.svelte'
  import Home from './routes/Home.svelte'
  import Cart from './routes/Cart.svelte'
  import Checkout from './routes/Checkout.svelte'
  import PaymentStatus from './routes/PaymentStatus.svelte'

  // Simple hash-based router for demo
  let currentRoute = $state(window.location.hash.slice(1) || '/')
  
  function handleHashChange() {
    currentRoute = window.location.hash.slice(1) || '/'
  }

  $effect(() => {
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  })
</script>

<div class="min-h-screen">
  <Header />
  
  {#if currentRoute === '/'}
    <Home />
  {:else if currentRoute === '/cart'}
    <Cart />
  {:else if currentRoute === '/checkout'}
    <Checkout />
  {:else if currentRoute.startsWith('/payment/')}
    <PaymentStatus paymentId={currentRoute.replace('/payment/', '')} />
  {:else}
    <Home />
  {/if}
</div>
