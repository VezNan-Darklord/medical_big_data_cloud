import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CloseOutlined } from '@ant-design/icons'

type PopWindowProps = {
  open: boolean
  onClose: () => void
  title?: string
  width?: number
  children: React.ReactNode
}

export const PopWindow = ({ open, onClose, title, width = 420, children }: PopWindowProps) => {
  const overlayRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className="relative max-h-[85vh] overflow-y-auto rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.18)]"
        style={{ width }}
      >
        {title && (
          <div className="mb-5 flex items-center justify-between">
            <div className="text-lg font-semibold text-slate-900">{title}</div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            >
              <CloseOutlined />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
