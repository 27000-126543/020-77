import { ReactNode, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import Button from './Button'
import { cn } from '@/lib/utils'

export interface ModalProps {
  open: boolean
  title?: string
  children?: ReactNode
  width?: 'sm' | 'md' | 'lg' | 'xl' | 'auto'
  footer?: ReactNode
  onConfirm?: () => void
  onCancel?: () => void
  onClose?: () => void
  confirmText?: string
  cancelText?: string
  confirmLoading?: boolean
  hideFooter?: boolean
  closeOnMaskClick?: boolean
  className?: string
  titleClassName?: string
}

const widthStyles: Record<NonNullable<ModalProps['width']>, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  auto: 'max-w-fit',
}

export default function Modal({
  open,
  title,
  children,
  width = 'md',
  footer,
  onConfirm,
  onCancel,
  onClose,
  confirmText = '确认',
  cancelText = '取消',
  confirmLoading = false,
  hideFooter = false,
  closeOnMaskClick = true,
  className,
  titleClassName,
}: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose?.()
        onCancel?.()
      }
    },
    [open, onClose, onCancel]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, handleKeyDown])

  if (!open) return null

  const handleMaskClick = () => {
    if (closeOnMaskClick) {
      onClose?.()
      onCancel?.()
    }
  }

  const handleClose = () => {
    onClose?.()
    onCancel?.()
  }

  const defaultFooter = (
    <>
      <Button variant="secondary" onClick={onCancel || onClose}>
        {cancelText}
      </Button>
      <Button variant="primary" onClick={onConfirm} loading={confirmLoading}>
        {confirmText}
      </Button>
    </>
  )

  return createPortal(
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'animate-fade-in'
      )}
    >
      <div
        className="absolute inset-0 bg-neutral-950/70 backdrop-blur-xs"
        onClick={handleMaskClick}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        className={cn(
          'relative w-full rounded-md bg-background-light border border-neutral-700 shadow-card',
          'animate-slide-in-up',
          widthStyles[width],
          className
        )}
      >
        <div
          className={cn(
            'flex items-center justify-between px-5 py-3.5 border-b border-neutral-700',
            titleClassName
          )}
        >
          {title && (
            <h2
              id="modal-title"
              className="text-[15px] font-semibold text-neutral-100 tracking-wide"
            >
              {title}
            </h2>
          )}
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'w-8 h-8 rounded-sm flex items-center justify-center',
              'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/50',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-primary-light/50'
            )}
            aria-label="关闭弹窗"
          >
            <X className="w-4 h-4" strokeWidth={2.2} />
          </button>
        </div>

        <div className="px-5 py-4 text-sm text-neutral-300 max-h-[60vh] overflow-y-auto scrollbar-thin">
          {children}
        </div>

        {!hideFooter && (
          <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-neutral-700 bg-neutral-900/30 rounded-b-md">
            {footer || defaultFooter}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}
