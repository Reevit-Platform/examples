'use client'

import { useState, useEffect, useCallback } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Cancel01Icon, CheckmarkCircle02Icon, AlertCircleIcon, InformationCircleIcon } from '@hugeicons/core-free-icons'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

let toastListeners: ((toast: Toast) => void)[] = []

export const toast = {
  success: (message: string) => {
    const t: Toast = { id: Date.now().toString(), type: 'success', message }
    toastListeners.forEach((fn) => fn(t))
  },
  error: (message: string) => {
    const t: Toast = { id: Date.now().toString(), type: 'error', message }
    toastListeners.forEach((fn) => fn(t))
  },
  info: (message: string) => {
    const t: Toast = { id: Date.now().toString(), type: 'info', message }
    toastListeners.forEach((fn) => fn(t))
  },
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, toast])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id))
    }, 4000)
  }, [])

  useEffect(() => {
    toastListeners.push(addToast)
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== addToast)
    }
  }, [addToast])

  const icons = {
    success: <HugeiconsIcon icon={CheckmarkCircle02Icon} className="h-5 w-5 text-green-500" />,
    error: <HugeiconsIcon icon={AlertCircleIcon} className="h-5 w-5 text-destructive" />,
    info: <HugeiconsIcon icon={InformationCircleIcon} className="h-5 w-5 text-primary" />,
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-3 px-4 py-3 bg-card border rounded-lg shadow-lg animate-in slide-in-from-right"
        >
          {icons[t.type]}
          <span className="text-sm font-medium">{t.message}</span>
          <button
            onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
            className="ml-2 text-muted-foreground hover:text-foreground"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
