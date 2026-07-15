import { useState } from 'react'
import { Button, Card, Form, Input, Select, DatePicker, Tag, message, Skeleton, InputNumber, Spin } from 'antd'
import { PlusOutlined, SendOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useListHealthWarningsQuery, useCreateHealthWarningMutation, useHandleHealthWarningMutation, useAssignHealthWarningMutation } from '../../../api/hooks/healthWarningHooks'
import { useListElderlyProfilesQuery } from '../../../api/hooks/elderlyProfileHooks'
import { StatusTag, PopWindow } from '../common'
import { useIntersectionObserver } from '../common/useIntersectionObserver'
import type { HealthWarningCreateRequest } from '../../../api/models/HealthWarningCreateRequest'
import dayjs from 'dayjs'
import type { HealthWarning } from '../../../api/models/HealthWarning'
import type { HealthWarningHandleRequest } from '../../../api/models/HealthWarningHandleRequest'

const severityColors: Record<string, string> = { low: 'blue', medium: 'orange', high: 'red', critical: '#7c0221' }
const severityBg: Record<string, string> = { low: 'bg-blue-50 border-blue-200', medium: 'bg-orange-50 border-orange-200', high: 'bg-red-50 border-red-200', critical: 'bg-rose-100 border-rose-300' }

function WarningCard({ warning, onHandle, onAssign }: { warning: HealthWarning; onHandle: (id: string) => void; onAssign: (id: string) => void }) {
  return (
    <Card className={`overflow-hidden rounded-2xl border shadow-sm ${severityBg[warning.severity!] ?? 'border-slate-200'}`} styles={{ body: { padding: 20 } }}>
      <div className="flex items-start justify-between gap-2"><Tag color={severityColors[warning.severity!] ?? 'default'}>{warning.severity}</Tag><StatusTag value={warning.status!} /></div>
      <div className="mt-3 font-semibold text-slate-900">{warning.warningType}</div>
      <div className="mt-1 text-sm text-slate-500">老人: {warning.elderlyId?.slice(0, 8)}</div>
      {warning.metricName && <div className="mt-2 rounded-lg bg-white/60 px-3 py-2 text-sm">{warning.metricName}: <span className="font-semibold">{warning.metricValue}</span> / <span className="text-slate-400">{warning.thresholdValue}</span></div>}
      <div className="mt-2 text-xs text-slate-400">{warning.occurredAt}</div>
      <div className="mt-3 flex gap-2">
        {warning.status !== 'processed' && <Button size="small" type="primary" ghost icon={<CheckCircleOutlined />} onClick={() => onHandle(warning.id!)}>处理</Button>}
        <Button size="small" icon={<SendOutlined />} onClick={() => onAssign(warning.id!)}>转派</Button>
      </div>
    </Card>
  )
}

function CreateWarningModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  const createMutation = useCreateHealthWarningMutation()
  const { data: profiles } = useListElderlyProfilesQuery({ pageSize: 200 })
  const elderlyList = profiles?.pages.flatMap(p => (p.data)?.list ?? []) ?? []

  return (
    <PopWindow open={open} onClose={onClose} title="创建健康预警" width={560}>
      <Form form={form} layout="vertical" onFinish={(values: HealthWarningCreateRequest) => {
        createMutation.mutate({ ...values, occurredAt: dayjs(values.occurredAt).format('YYYY-MM-DDTHH:mm:ss'), status: 'unprocessed' } as HealthWarningCreateRequest, {
          onSuccess: () => { message.success('预警创建成功'); form.resetFields(); onClose() },
          onError: (err: Error) => message.error(err?.message ?? '创建失败'),
        })
      }}>
        <Form.Item name="elderlyId" label="关联老人" rules={[{ required: true }]}>
          <Select showSearch filterOption={(input, option) => (option?.label as string)?.includes(input)} options={elderlyList.map((e) => ({ value: e.id, label: `${e.name} (${e.id?.slice(0, 8)})` }))} />
        </Form.Item>
        <div className="grid gap-0 md:grid-cols-2 md:gap-x-4">
          <Form.Item name="warningType" label="预警类型" rules={[{ required: true }]}><Select options={['abnormal_heart_rate','blood_pressure','blood_sugar','sleep','fall','other'].map(v => ({ value: v, label: v }))} /></Form.Item>
          <Form.Item name="severity" label="严重程度" rules={[{ required: true }]}><Select options={['low','medium','high','critical'].map(v => ({ value: v, label: v }))} /></Form.Item>
          <Form.Item name="source" label="来源" rules={[{ required: true }]}><Select options={['device','manual','self_report'].map(v => ({ value: v, label: v }))} /></Form.Item>
          <Form.Item name="occurredAt" label="发生时间" rules={[{ required: true }]} getValueFromEvent={(d: dayjs.Dayjs | null) => d?.toISOString()}><DatePicker showTime className="w-full" /></Form.Item>
          <Form.Item name="metricName" label="指标名"><Input /></Form.Item>
          <Form.Item name="metricValue" label="指标值"><InputNumber className="w-full" /></Form.Item>
        </div>
        <Form.Item name="remark" label="备注"><Input.TextArea rows={2} /></Form.Item>
        <Button type="primary" htmlType="submit" loading={createMutation.isPending} block size="large">提交预警</Button>
      </Form>
    </PopWindow>
  )
}

function HandleModal({ open, warningId, onClose }: { open: boolean; warningId: string; onClose: () => void }) {
  const [form] = Form.useForm()
  const handleMutation = useHandleHealthWarningMutation()

  return (
    <PopWindow open={open} onClose={onClose} title="处理预警" width={440}>
      <Form form={form} layout="vertical" onFinish={(v: HealthWarningHandleRequest) => {
        handleMutation.mutate({ id: warningId, status: v.status, result: v.result, nextAction: v.nextAction, remark: v.remark } , {
          onSuccess: () => { message.success('处理完成'); form.resetFields(); onClose() },
          onError: (err: Error) => message.error(err?.message ?? '处理失败'),
        })
      }}>
        <Form.Item name="status" label="处理结果" rules={[{ required: true }]}><Select options={[{ value: 'processed', label: '已处理' }, { value: 'closed', label: '关闭' }]} /></Form.Item>
        <Form.Item name="result" label="处理说明"><Input.TextArea rows={3} /></Form.Item>
        <Form.Item name="nextAction" label="后续动作"><Select options={['follow_up','recheck','none'].map(v => ({ value: v, label: v }))} /></Form.Item>
        <Button type="primary" htmlType="submit" loading={handleMutation.isPending} block>确认处理</Button>
      </Form>
    </PopWindow>
  )
}

function AssignModal({ open, warningId, onClose }: { open: boolean; warningId: string; onClose: () => void }) {
  const [form] = Form.useForm()
  const assignMutation = useAssignHealthWarningMutation()

  return (
    <PopWindow open={open} onClose={onClose} title="转派预警" width={400}>
      <Form form={form} layout="vertical" onFinish={(v: { targetDoctorId: string }) => {
        assignMutation.mutate({ id: warningId, targetDoctorId: v.targetDoctorId }, {
          onSuccess: () => { message.success('转派成功'); form.resetFields(); onClose() },
          onError: (err: Error) => message.error(err?.message ?? '转派失败'),
        })
      }}>
        <Form.Item name="targetDoctorId" label="目标医生 ID" rules={[{ required: true }]}><Input placeholder="输入医生 ID" /></Form.Item>
        <Button type="primary" htmlType="submit" loading={assignMutation.isPending} block>确认转派</Button>
      </Form>
    </PopWindow>
  )
}

export default function HealthWarningsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [handleId, setHandleId] = useState('')
  const [assignId, setAssignId] = useState('')
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListHealthWarningsQuery({ pageSize: 20 })
  const allWarnings = data?.pages.flatMap(p => (p.data)?.list ?? []) ?? []

  const sentinelRef = useIntersectionObserver(
    () => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() },
    !isLoading,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div><div className="text-2xl font-semibold text-slate-900">健康预警管理</div><div className="mt-2 text-sm text-slate-500">共 {allWarnings.length} 条预警</div></div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>创建预警</Button>
      </div>
      {isLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allWarnings.map((w: HealthWarning) => <WarningCard key={w.id} warning={w} onHandle={setHandleId} onAssign={setAssignId} />)}
          </div>
          <div ref={sentinelRef} className="h-px" />
          {isFetchingNextPage && <div className="text-center"><Spin /></div>}
        </>
      )}
      <CreateWarningModal open={createOpen} onClose={() => setCreateOpen(false)} />
      {handleId && <HandleModal open={!!handleId} warningId={handleId} onClose={() => setHandleId('')} />}
      {assignId && <AssignModal open={!!assignId} warningId={assignId} onClose={() => setAssignId('')} />}
    </div>
  )
}
