import { useState } from 'react'
import { Button, Card, Form, Input, message, Popconfirm, Skeleton, Spin } from 'antd'
import { PlusOutlined, WifiOutlined, DisconnectOutlined, DeleteOutlined, LinkOutlined, EditOutlined } from '@ant-design/icons'
import { useListDevicesQuery, useCreateDeviceMutation, useBindDeviceMutation, useUnbindDeviceMutation, useUpdateDeviceMutation, useDeleteDeviceMutation } from '../../../api/hooks/deviceHooks'
import { StatusTag, PopWindow } from '../common'
import { AccountSelect } from '../common/AccountSelect'
import { useIntersectionObserver } from '../common/useIntersectionObserver'
import type { DeviceCreateRequest } from '../../../api/models/DeviceCreateRequest'
import type { DeviceUpdateRequest } from '../../../api/models/DeviceUpdateRequest'
import { useCurrentRoleCode } from '../../store/useCurrentRoleCode'

function CreateDeviceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  const createMutation = useCreateDeviceMutation()

  return (
    <PopWindow open={open} onClose={onClose} title="添加设备" width={440}>
      <Form form={form} layout="vertical" onFinish={(v: DeviceCreateRequest) => {
        createMutation.mutate(v, {
          onSuccess: () => { message.success('设备添加成功'); form.resetFields(); onClose() },
          onError: (err: Error) => message.error(err?.message ?? '添加失败'),
        })
      }}>
        <Form.Item name="deviceName" label="设备名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="deviceType" label="设备类型" rules={[{ required: true }]}><Input placeholder="如: blood_pressure_monitor" /></Form.Item>
        <Form.Item name="deviceSn" label="设备 SN" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="firmwareVersion" label="固件版本" rules={[{ required: true }]}><Input placeholder="如: 1.0.0" /></Form.Item>
        <Button type="primary" htmlType="submit" loading={createMutation.isPending} block size="large">添加设备</Button>
      </Form>
    </PopWindow>
  )
}

function BindDeviceModal({ open, deviceId, onClose }: { open: boolean; deviceId: string; onClose: () => void }) {
  const [form] = Form.useForm()
  const bindMutation = useBindDeviceMutation()

  return (
    <PopWindow open={open} onClose={onClose} title="绑定设备" width={420}>
      <Form form={form} layout="vertical" onFinish={(v: { elderlyId: string }) => {
        bindMutation.mutate({ deviceId, elderlyId: v.elderlyId }, {
          onSuccess: () => { message.success('绑定成功'); onClose() },
          onError: (err: Error) => message.error(err?.message ?? '绑定失败'),
        })
      }}>
        <Form.Item name="elderlyId" label="选择老人" rules={[{ required: true }]}>
          <AccountSelect />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={bindMutation.isPending} block size="large">确认绑定</Button>
      </Form>
    </PopWindow>
  )
}

interface DeviceItem {
  id: string
  deviceName: string
  deviceType: string
  deviceSn: string
  firmwareVersion: string
  onlineStatus: string
  bindingStatus: string
  elderlyId: string
  elderlyName: string
  lastReportAt: string
}

function DeviceCard({
  device,
  canDelete,
  canManage,
  onBind,
  onEdit,
}: {
  device: DeviceItem
  canDelete: boolean
  canManage: boolean
  onBind: (deviceId: string) => void
  onEdit: (device: DeviceItem) => void
}) {
  const unbindMutation = useUnbindDeviceMutation()
  const deleteMutation = useDeleteDeviceMutation()
  const isOnline = device.onlineStatus === 'online'
  const isBound = device.bindingStatus === 'bound'

  return (
    <Card className={`overflow-hidden rounded-2xl border shadow-sm ${isOnline ? 'border-emerald-200' : 'border-orange-200'}`} styles={{ body: { padding: 20 } }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isOnline ? <WifiOutlined className="text-emerald-500" /> : <DisconnectOutlined className="text-orange-500" />}
          <span className="text-xs text-slate-500">{isOnline ? '在线' : '离线'}</span>
        </div>
        <div className="flex items-center gap-1">
          <StatusTag value={device.bindingStatus} />
          {canDelete && (
            <Popconfirm
              title="确认删除这台设备？"
              onConfirm={() => deleteMutation.mutate(device.id, {
                onSuccess: () => message.success('设备已删除'),
                onError: (error: Error) => message.error(error.message || '删除失败'),
              })}
            >
              <Button size="small" type="text" danger icon={<DeleteOutlined />} loading={deleteMutation.isPending} />
            </Popconfirm>
          )}
        </div>
      </div>
      <div className="mt-3 font-semibold text-slate-900">{device.deviceName}</div>
      <div className="mt-1 text-sm text-slate-500">{device.deviceType} · {device.deviceSn}</div>
      <div className="mt-2 text-xs text-slate-400">老人: {device.elderlyName || (device.elderlyId?.slice(0, 8)) || '-'} · {device.lastReportAt || '-'}</div>
      <div className="mt-3 flex gap-1">
        {canManage && <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(device)}>编辑</Button>}
        {canManage && (isBound ? (
            <Button size="small" danger onClick={() => unbindMutation.mutate(device.id, {
              onSuccess: () => message.success('解绑成功'),
              onError: (e: Error) => message.error(e?.message ?? '解绑失败'),
            })} loading={unbindMutation.isPending}>解绑</Button>
          ) : (
            <Button size="small" type="primary" ghost icon={<LinkOutlined />} onClick={() => onBind(device.id)}>绑定</Button>
          ))}
      </div>
    </Card>
  )
}

function EditDeviceModal({ open, device, onClose }: { open: boolean; device: DeviceItem | null; onClose: () => void }) {
  const [form] = Form.useForm()
  const updateMutation = useUpdateDeviceMutation()

  if (!device) return null

  return (
    <PopWindow open={open} onClose={onClose} title="编辑设备" width={440}>
      <Form form={form} layout="vertical" initialValues={device} onFinish={(v: DeviceUpdateRequest) => {
        updateMutation.mutate({ id: device.id, ...v }, {
          onSuccess: () => { message.success('设备更新成功'); onClose() },
          onError: (err: Error) => message.error(err?.message ?? '更新失败'),
        })
      }}>
        <Form.Item name="deviceName" label="设备名称" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="deviceType" label="设备类型" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="firmwareVersion" label="固件版本" rules={[{ required: true }]}><Input /></Form.Item>
        <Button type="primary" htmlType="submit" loading={updateMutation.isPending} block size="large">保存修改</Button>
      </Form>
    </PopWindow>
  )
}

export default function DevicesPage() {
  const role = useCurrentRoleCode()
  const canManage = role === 'admin' || role === 'doctor'
  const canDelete = role === 'admin'
  const [createOpen, setCreateOpen] = useState(false)
  const [bindDeviceId, setBindDeviceId] = useState('')
  const [editDevice, setEditDevice] = useState<DeviceItem | null>(null)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListDevicesQuery({ pageSize: 20 })
  const allDevices: DeviceItem[] = data?.pages.flatMap(p =>
    ((p.data as Record<string, unknown>)?.list as DeviceItem[]) ?? []
  ) ?? []

  const sentinelRef = useIntersectionObserver(
    () => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() },
    !isLoading,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div><div className="text-2xl font-semibold text-slate-900">设备管理</div><div className="mt-2 text-sm text-slate-500">共 {allDevices.length} 台设备</div></div>
        {canManage && <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>添加设备</Button>}
      </div>
      {isLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allDevices.map(d => (
              <DeviceCard
                key={d.id}
                device={d}
                canDelete={canDelete}
                canManage={canManage}
                onBind={setBindDeviceId}
                onEdit={setEditDevice}
              />
            ))}
          </div>
          <div ref={sentinelRef} className="h-px" />
          {isFetchingNextPage && <div className="text-center"><Spin /></div>}
        </>
      )}
      {canManage && <CreateDeviceModal open={createOpen} onClose={() => setCreateOpen(false)} />}
      {canManage && bindDeviceId && <BindDeviceModal open={!!bindDeviceId} deviceId={bindDeviceId} onClose={() => setBindDeviceId('')} />}
      {canManage && editDevice && <EditDeviceModal open={!!editDevice} device={editDevice} onClose={() => setEditDevice(null)} />}
    </div>
  )
}
