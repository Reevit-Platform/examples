import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToasterContextValue {
  toasts: Toast[]
  addToast: (message: string, type: Toast['type']) => void
  removeToast: (id: string) => void
}

const ToasterContext = createContext<ToasterContextValue | null>(null)

let toastHandler: ((message: string, type: Toast['type']) => void) | null = null

export const toast = {
  success: (message: string) => toastHandler?.(message, 'success'),
  error: (message: string) => toastHandler?.(message, 'error'),
  info: (message: string) => toastHandler?.(message, 'info'),
}

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  useEffect(() => {
    toastHandler = addToast
    return () => {
      toastHandler = null
    }
  }, [])

  // Auto-dismiss toasts
  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        removeToast(toasts[0].id)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toasts])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-[var(--color-success)]" />,
    error: <XCircle className="w-5 h-5 text-[var(--color-error)]" />,
    info: <Info className="w-5 h-5 text-[var(--color-accent)]" />,
  }

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="glass px-4 py-3 rounded-xl flex items-center gap-3 min-w-[280px] animate-[slideIn_0.3s_ease]"
          style={{
            animation: 'slideIn 0.3s ease',
          }}
        >
          {icons[t.type]}
          <span className="flex-1 text-sm font-medium">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
