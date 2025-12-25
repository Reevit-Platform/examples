import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Home, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'
import { getPaymentStatus } from '@/lib/api'
import { formatPrice } from '@/lib/products'

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-[var(--color-warning)]',
    bg: 'bg-[var(--color-warning)]/10',
    title: 'Payment Pending',
    description: 'Waiting for payment confirmation...',
  },
  processing: {
    icon: RefreshCw,
    color: 'text-[var(--color-accent)]',
    bg: 'bg-[var(--color-accent)]/10',
    title: 'Processing Payment',
    description: 'Your payment is being processed...',
  },
  succeeded: {
    icon: CheckCircle,
    color: 'text-[var(--color-success)]',
    bg: 'bg-[var(--color-success)]/10',
    title: 'Payment Successful',
    description: 'Your order has been confirmed!',
  },
  failed: {
    icon: XCircle,
    color: 'text-[var(--color-error)]',
    bg: 'bg-[var(--color-error)]/10',
    title: 'Payment Failed',
    description: 'There was an issue processing your payment.',
  },
}

export default function PaymentStatus() {
  const { id } = useParams<{ id: string }>()

  const { data: payment, isLoading, error } = useQuery({
    queryKey: ['payment', id],
    queryFn: () => getPaymentStatus(id!),
    enabled: !!id,
    refetchInterval: (query) => {
      const status = query.state.data?.status
      // Stop polling on terminal states
      if (['succeeded', 'failed', 'canceled'].includes(status || '')) {
        return false
      }
      return 3000 // Poll every 3 seconds
    },
  })

  if (isLoading) {
    return (
      <main className="container mx-auto px-6 py-24 text-center">
        <div className="animate-spin w-12 h-12 border-4 border-[var(--color-accent)] border-t-transparent rounded-full mx-auto mb-6" />
        <p className="text-[var(--color-muted-foreground)]">Loading payment status...</p>
      </main>
    )
  }

  if (error || !payment) {
    return (
      <main className="container mx-auto px-6 py-24 text-center">
        <div className="text-6xl mb-6">⚠️</div>
        <h1 className="text-3xl font-bold mb-4">Payment Not Found</h1>
        <p className="text-[var(--color-muted-foreground)] mb-8">
          Unable to find the payment details
        </p>
        <Link to="/" className="btn btn-primary h-12 px-8">
          <Home className="w-5 h-5 mr-2" />
          Return Home
        </Link>
      </main>
    )
  }

  const status = statusConfig[payment.status as keyof typeof statusConfig] || statusConfig.pending
  const StatusIcon = status.icon

  return (
    <main className="container mx-auto px-6 py-16">
      <div className="max-w-lg mx-auto">
        {/* Status Card */}
        <div className="glass p-10 rounded-3xl text-center">
          {/* Icon */}
          <div className={`w-20 h-20 rounded-full ${status.bg} mx-auto mb-6 flex items-center justify-center`}>
            <StatusIcon className={`w-10 h-10 ${status.color} ${payment.status === 'processing' ? 'animate-spin' : ''}`} />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-2">{status.title}</h1>
          <p className="text-[var(--color-muted-foreground)] mb-8">{status.description}</p>

          {/* Details */}
          <div className="glass p-6 rounded-2xl text-left space-y-4 mb-8">
            <div className="flex justify-between">
              <span className="text-[var(--color-muted-foreground)]">Payment ID</span>
              <span className="font-mono text-sm">{payment.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted-foreground)]">Amount</span>
              <span className="font-bold text-[var(--color-accent)]">
                {formatPrice(payment.amount, payment.currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted-foreground)]">Provider</span>
              <span className="capitalize">{payment.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--color-muted-foreground)]">Status</span>
              <span className={`font-bold capitalize ${status.color}`}>{payment.status}</span>
            </div>
            {payment.fee_amount && (
              <div className="flex justify-between">
                <span className="text-[var(--color-muted-foreground)]">Fee</span>
                <span>{formatPrice(payment.fee_amount, payment.currency)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link to="/" className="btn btn-primary flex-1 h-12">
              <Home className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Polling indicator */}
        {!['succeeded', 'failed', 'canceled'].includes(payment.status) && (
          <p className="text-center mt-6 text-sm text-[var(--color-muted-foreground)] flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            Checking for updates...
          </p>
        )}
      </div>
    </main>
  )
}
