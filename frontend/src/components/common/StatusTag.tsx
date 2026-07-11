import { Tag } from 'antd'

export function StatusTag({ value }: { value: string }) {
  const colorMap: Record<string, string> = {
    active: 'green',
    enabled: 'green',
    online: 'green',
    unprocessed: 'red',
    high: 'red',
    disabled: 'default',
    offline: 'orange',
    processing: 'processing',
    processed: 'blue',
    paused: 'orange',
    watching: 'purple',
    bound: 'cyan',
    unbound: 'default',
  }

  return <Tag color={colorMap[value] ?? 'default'}>{value}</Tag>
}
