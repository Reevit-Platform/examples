import axios, { AxiosError } from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const responseData = error.response?.data as Record<string, unknown> | undefined
    let errorMessage = 'An error occurred'

    if (responseData) {
      if (typeof responseData.error === 'string') {
        errorMessage = responseData.error
      } else if (typeof responseData.message === 'string') {
        errorMessage = responseData.message
      }
    } else if (error.message) {
      errorMessage = error.message
    }

    return Promise.reject(new Error(errorMessage))
  }
)

// Types
export interface CreatePaymentRequest {
  amount: number
  currency: string
  method: string
  country: string
  customer_id?: string
  metadata?: Record<string, string>
}

export interface PaymentResponse {
  id: string
  status: string
  amount: number
  currency: string
  method: string
  provider: string
  provider_ref_id?: string
  client_secret?: string
  created_at: string
}

export interface PaymentStatusResponse {
  id: string
  status: string
  amount: number
  currency: string
  provider: string
  fee_amount?: number
  net_amount?: number
}

// API functions
export async function createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
  const response = await api.post<PaymentResponse>('/payments/intents', data, {
    headers: {
      'Idempotency-Key': `pay_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    },
  })
  return response.data
}

export async function getPaymentStatus(paymentId: string): Promise<PaymentStatusResponse> {
  const response = await api.get<PaymentStatusResponse>(`/payments/${paymentId}`)
  return response.data
}
