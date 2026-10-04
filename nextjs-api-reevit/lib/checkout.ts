export interface CheckoutIntentRequest {
  amount: number
  currency: string
  method: string
  country: string
  reference: string
  metadata: Record<string, unknown>
}

export async function createPaymentIntent(payload: CheckoutIntentRequest, idempotencyKey: string) {
  if (!idempotencyKey.trim()) throw new Error('An order idempotency key is required')

  const response = await fetch(`${process.env.NEXT_PUBLIC_REEVIT_BASE_URL || 'http://localhost:8080'}/v1/payments/intents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': idempotencyKey,
      'X-Reevit-Key': process.env.NEXT_PUBLIC_REEVIT_PUBLIC_KEY || 'pfk_test_demo',
      'X-Org-Id': process.env.NEXT_PUBLIC_REEVIT_ORG_ID || 'your-org-id',
    },
    body: JSON.stringify(payload),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error?.message || data.message || 'Failed to initiate checkout')
  return data as { id: string; status: string }
}
