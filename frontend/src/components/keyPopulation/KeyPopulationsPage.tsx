import { useState } from 'react'
import { Button, Card, Form, Input, InputNumber, Select, Tag, message, Skeleton, Spin } from 'antd'
import { PlusOutlined, CloseOutlined, EditOutlined } from '@ant-design/icons'
import { useListKeyPopulationsQuery, useCreateKeyPopulationMutation, useCloseKeyPopulationMutation, useUpdateKeyPopulationMutation } from '../../../api/hooks/keyPopulationHooks'
import { StatusTag, PopWindow, ElderlyAccountSelect } from '../common'
import { useIntersectionObserver } from '../common/useIntersectionObserver'
import type { KeyPopulationInput } from '../../../api/models/KeyPopulationInput'

function CreateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  const createMutation = useCreateKeyPopulationMutation()

  return (
    <PopWindow open={open} onClose={onClose} title="添加重点人群" width={500}>
      <Form form={form} layout="vertical" onFinish={(v: KeyPopulationInput) => {
        createMutation.mutate(v, { onSuccess: () => { message.success('添加成功'); form.resetFields(); onClose() }, onError: (err: Error) => message.error(err?.message ?? '失败') })
      }}>
        <Form.Item name="elderlyId" label="老人" rules={[{ required: true }]}><ElderlyAccountSelect /></Form.Item>
        <Form.Item name="category" label="类别" rules={[{ required: true }]}><Select options={['慢病高风险','跌倒高风险','认知关注','失能','高龄'].map(v => ({ value: v, label: v }))} /></Form.Item>
        <Form.Item name="level" label="等级"><Input placeholder="如: A, B, C" /></Form.Item>
        <Form.Item name="reason" label="原因"><Input.TextArea rows={2} /></Form.Item>
        <Form.Item name="ownerDoctorId" label="负责医生 ID"><Input /></Form.Item>
        <Form.Item name="followUpCycleDays" label="随访周期(天)"><InputNumber className="w-full" min={1} /></Form.Item>
        <Form.Item name="status" label="状态"><Select options={[{ value: 'active', label: '活跃' }, { value: 'watching', label: '观察' }]} /></Form.Item>
        <Button type="primary" htmlType="submit" loading={createMutation.isPending} block>确认添加</Button>
      </Form>
    </PopWindow>
  )
}

interface PopulationItem {
  id: string; category: string; status: string; elderlyId: string
  level?: string; reason?: string; ownerDoctorId?: string; followUpCycleDays?: number
}

function EditModal({ open, item, onClose }: { open: boolean; item: PopulationItem | null; onClose: () => void }) {
  const [form] = Form.useForm()
  const updateMutation = useUpdateKeyPopulationMutation()

  if (!item) return null

  return (
    <PopWindow open={open} onClose={onClose} title="编辑重点人群" width={500}>
      <Form form={form} layout="vertical" initialValues={item} onFinish={(v: KeyPopulationInput) => {
        updateMutation.mutate({ id: item.id, ...v }, { onSuccess: () => { message.success('更新成功'); onClose() }, onError: (err: Error) => message.error(err?.message ?? '失败') })
      }}>
        <Form.Item name="elderlyId" label="老人" rules={[{ required: true }]}><ElderlyAccountSelect /></Form.Item>
        <Form.Item name="category" label="类别" rules={[{ required: true }]}><Select options={['慢病高风险','跌倒高风险','认知关注','失能','高龄'].map(v => ({ value: v, label: v }))} /></Form.Item>
        <Form.Item name="level" label="等级"><Input /></Form.Item>
        <Form.Item name="reason" label="原因"><Input.TextArea rows={2} /></Form.Item>
        <Form.Item name="ownerDoctorId" label="负责医生 ID"><Input /></Form.Item>
        <Form.Item name="followUpCycleDays" label="随访周期(天)"><InputNumber className="w-full" min={1} /></Form.Item>
        <Form.Item name="status" label="状态"><Select options={[{ value: 'active', label: '活跃' }, { value: 'watching', label: '观察' }]} /></Form.Item>
        <Button type="primary" htmlType="submit" loading={updateMutation.isPending} block>保存修改</Button>
      </Form>
    </PopWindow>
  )
}

function PopulationCard({ item, onEdit }: { item: PopulationItem; onEdit: (item: PopulationItem) => void }) {
  const closeMutation = useCloseKeyPopulationMutation()
  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm" styles={{ body: { padding: 20 } }}>
      <div className="flex items-center justify-between"><Tag color="processing">{item.category}</Tag><StatusTag value={item.status} /></div>
      <div className="mt-3 font-semibold text-slate-900">老人: {item.elderlyId?.slice(0, 8)}{item.level ? <Tag className="ml-2">{item.level}</Tag> : null}</div>
      {item.reason && <div className="mt-2 text-sm text-slate-500">{item.reason}</div>}
      <div className="mt-2 flex items-center gap-4 text-xs text-slate-400"><span>负责: {item.ownerDoctorId?.slice(0, 8) || '-'}</span><span>周期: {item.followUpCycleDays ? `${item.followUpCycleDays} 天` : '-'}</span></div>
      <div className="mt-3 flex gap-1">
        <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(item)}>编辑</Button>
        {item.status === 'active' && (
          <Button size="small" danger icon={<CloseOutlined />} onClick={() => closeMutation.mutate(item.id, { onSuccess: () => message.success('已关闭'), onError: (e: Error) => message.error(e?.message ?? '失败') })} loading={closeMutation.isPending}>关闭</Button>
        )}
      </div>
    </Card>
  )
}

export default function KeyPopulationsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState<PopulationItem | null>(null)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListKeyPopulationsQuery({ pageSize: 20 })
  const allItems: PopulationItem[] = (data?.pages.flatMap(p => ((p.data as unknown as { list?: PopulationItem[] })?.list ?? [])) ?? []) as PopulationItem[]
  const sentinelRef = useIntersectionObserver(() => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() }, !isLoading)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div><div className="text-2xl font-semibold text-slate-900">重点人群管理</div><div className="mt-2 text-sm text-slate-500">共 {allItems.length} 人</div></div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>添加人群</Button>
      </div>
      {isLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : (
        <><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{allItems.map(i => <PopulationCard key={i.id} item={i} onEdit={setEditItem} />)}</div><div ref={sentinelRef} className="h-px" />{isFetchingNextPage && <div className="text-center"><Spin /></div>}</>
      )}
      <CreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditModal open={!!editItem} item={editItem} onClose={() => setEditItem(null)} />
    </div>
  )
}
