import type { ReactNode } from 'react'
import { Card } from 'antd'

export function PanelCard({ title, subtitle, extra, children, dark = false }: { title: ReactNode; subtitle?: string; extra?: ReactNode; children: ReactNode; dark?: boolean }) {
  return (
    <Card
      className={dark ? 'overflow-hidden rounded-2xl border border-white/10 bg-[#071122] text-white shadow-[0_18px_60px_rgba(6,24,44,0.4)]' : 'overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm'}
      styles={{ body: { padding: 20 } }}
      title={<div><div className={dark ? 'text-white' : 'text-slate-900'}>{title}</div>{subtitle ? <div className={dark ? 'text-xs text-slate-400' : 'text-xs text-slate-500'}>{subtitle}</div> : null}</div>}
      extra={extra}
    >
      {children}
    </Card>
  )
}
