import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const responseData = error.response?.data
    let errorMessage = 'An error occurred'
    if (responseData?.error) errorMessage = responseData.error
    else if (responseData?.message) errorMessage = responseData.message
    else if (error.message) errorMessage = error.message
    return Promise.reject(new Error(errorMessage))
  }
)

export interface PaymentResponse {
  id: string
  status: string
  amount: number
  currency: string
  provider: string
}

export async function createPayment(data: {
  amount: number
  currency: string
  method: string
  country: string
}): Promise<PaymentResponse> {
  const response = await api.post<PaymentResponse>('/payments/intents', data, {
    headers: { 'Idempotency-Key': `pay_${Date.now()}_${Math.random().toString(36).substring(7)}` },
  })
  return response.data
}

export async function getPaymentStatus(paymentId: string): Promise<PaymentResponse> {
  const response = await api.get<PaymentResponse>(`/payments/${paymentId}`)
  return response.data
}
