export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export const toastHandler: { current: ((message: string, type: Toast['type']) => void) | null } = { current: null }

export const toast = {
  success: (message: string) => toastHandler.current?.(message, 'success'),
  error: (message: string) => toastHandler.current?.(message, 'error'),
  info: (message: string) => toastHandler.current?.(message, 'info'),
}
