import { Button, Card, Skeleton, Tooltip, message } from 'antd'
import { PlusOutlined, WifiOutlined, DisconnectOutlined } from '@ant-design/icons'
import { useListDevicesQuery, useUnbindDeviceMutation } from '../../../api/hooks/deviceHooks'
import { StatusTag } from '../common'

function DeviceCard({ device }: { device: any }) {
  const unbindMutation = useUnbindDeviceMutation()
  const isOnline = device.onlineStatus === 'online'

  return (
    <Card className={`overflow-hidden rounded-2xl border shadow-sm ${isOnline ? 'border-emerald-200' : 'border-orange-200'}`} styles={{ body: { padding: 20 } }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">{isOnline ? <WifiOutlined className="text-emerald-500" /> : <DisconnectOutlined className="text-orange-500" />}<span className="text-xs text-slate-500">{isOnline ? '在线' : '离线'}</span></div>
        <StatusTag value={device.bindingStatus} />
      </div>
      <div className="mt-3 font-semibold text-slate-900">{device.deviceName}</div>
      <div className="mt-1 text-sm text-slate-500">{device.deviceType} · {device.deviceSn}</div>
      <div className="mt-2 text-xs text-slate-400">老人: {device.elderlyId?.slice(0, 8) || '-'} · {device.lastReportAt || '-'}</div>
      <div className="mt-3"><Button size="small" danger onClick={() => unbindMutation.mutate(device.id, { onSuccess: () => message.success('解绑成功'), onError: (e: any) => message.error(e?.message ?? '解绑失败') })} loading={unbindMutation.isPending}>解绑</Button></div>
    </Card>
  )
}

export default function DevicesPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListDevicesQuery({ pageSize: 20 })
  const allDevices = data?.pages.flatMap(p => (p.data as any)?.list ?? []) ?? []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div><div className="text-2xl font-semibold text-slate-900">设备管理</div><div className="mt-2 text-sm text-slate-500">共 {allDevices.length} 台设备</div></div>
        <Tooltip title="绑定设备接口尚未开放"><Button type="primary" size="large" icon={<PlusOutlined />} disabled>绑定设备</Button></Tooltip>
      </div>
      {isLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allDevices.map((d: any) => <DeviceCard key={d.id} device={d} />)}
        </div>
      )}
      {hasNextPage && <div className="text-center"><Button loading={isFetchingNextPage} onClick={() => fetchNextPage()}>加载更多</Button></div>}
    </div>
  )
}
