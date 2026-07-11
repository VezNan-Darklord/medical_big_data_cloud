import { Progress } from 'antd'

export function MiniProgress({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">{value}%</span>
      </div>
      <Progress percent={value} size="small" showInfo={false} strokeColor={{ from: '#22c55e', to: '#06b6d4' }} trailColor="#e2e8f0" />
    </div>
  )
}
