<script lang="ts">
  import { Home, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-svelte'
  import { getPaymentStatus } from '$lib/api'
  import { formatPrice } from '$lib/products'

  const { paymentId } = $props<{ paymentId: string }>()

  let payment = $state<{ id: string; status: string; amount: number; currency: string; provider: string } | null>(null)
  let isLoading = $state(true)
  let error = $state<string | null>(null)

  const statusConfig = {
    pending: { icon: Clock, color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning)]/10', title: 'Payment Pending', description: 'Waiting for payment confirmation...' },
    processing: { icon: RefreshCw, color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/10', title: 'Processing Payment', description: 'Your payment is being processed...' },
    succeeded: { icon: CheckCircle, color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/10', title: 'Payment Successful', description: 'Your order has been confirmed!' },
    failed: { icon: XCircle, color: 'text-[var(--color-error)]', bg: 'bg-[var(--color-error)]/10', title: 'Payment Failed', description: 'There was an issue processing your payment.' },
  }

  let status = $derived(statusConfig[(payment?.status as keyof typeof statusConfig) || 'pending'] || statusConfig.pending)

  async function fetchPayment() {
    try {
      payment = await getPaymentStatus(paymentId)
      isLoading = false

      // Continue polling if not terminal
      if (!['succeeded', 'failed', 'canceled'].includes(payment.status)) {
        setTimeout(fetchPayment, 3000)
      }
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load payment'
      isLoading = false
    }
  }

  $effect(() => {
    if (paymentId) {
      fetchPayment()
    }
  })
</script>

{#if isLoading}
  <main class="container mx-auto px-6 py-24 text-center">
    <div class="animate-spin w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full mx-auto mb-6"></div>
    <p class="text-[var(--color-muted-foreground)]">Loading payment status...</p>
  </main>
{:else if error || !payment}
  <main class="container mx-auto px-6 py-24 text-center">
    <div class="text-6xl mb-6">⚠️</div>
    <h1 class="text-3xl font-bold mb-4">Payment Not Found</h1>
    <p class="text-[var(--color-muted-foreground)] mb-8">Unable to find the payment details</p>
    <a href="#/" class="btn btn-primary h-12 px-8">
      <Home class="w-5 h-5 mr-2" /> Return Home
    </a>
  </main>
{:else}
  <main class="container mx-auto px-6 py-16">
    <div class="max-w-lg mx-auto">
      <div class="glass p-10 rounded-3xl text-center">
        <div class="w-20 h-20 rounded-full {status.bg} mx-auto mb-6 flex items-center justify-center">
          <svelte:component this={status.icon} class="w-10 h-10 {status.color} {payment.status === 'processing' ? 'animate-spin' : ''}" />
        </div>
        <h1 class="text-3xl font-bold mb-2">{status.title}</h1>
        <p class="text-[var(--color-muted-foreground)] mb-8">{status.description}</p>

        <div class="glass p-6 rounded-2xl text-left space-y-4 mb-8">
          <div class="flex justify-between">
            <span class="text-[var(--color-muted-foreground)]">Payment ID</span>
            <span class="font-mono text-sm">{payment.id}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--color-muted-foreground)]">Amount</span>
            <span class="font-bold text-[var(--color-accent)]">{formatPrice(payment.amount, payment.currency)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--color-muted-foreground)]">Provider</span>
            <span class="capitalize">{payment.provider}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-[var(--color-muted-foreground)]">Status</span>
            <span class="font-bold capitalize {status.color}">{payment.status}</span>
          </div>
        </div>

        <a href="#/" class="btn btn-primary w-full h-12">
          <Home class="w-5 h-5 mr-2" /> Continue Shopping
        </a>
      </div>

      {#if !['succeeded', 'failed', 'canceled'].includes(payment.status)}
        <p class="text-center mt-6 text-sm text-[var(--color-muted-foreground)] flex items-center justify-center gap-2">
          <RefreshCw class="w-4 h-4 animate-spin" /> Checking for updates...
        </p>
      {/if}
    </div>
  </main>
{/if}
