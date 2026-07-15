import { useState, useMemo } from 'react'
import { Button, Form, Input, InputNumber, Select, DatePicker, Table, Tag, message } from 'antd'
import { PlusOutlined, WarningOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { useGetCurrentUserQuery } from '../../../api/hooks/authHooks'
import { useListHealthWarningsQuery, useCreateHealthWarningMutation } from '../../../api/hooks/healthWarningHooks'
import { PanelCard, StatusTag, PopWindow } from '../common'
import type { HealthWarningCreateRequest } from '../../../api/models/HealthWarningCreateRequest'

const { TextArea } = Input

const severityColors: Record<string, string> = {
  low: 'blue', medium: 'orange', high: 'red', critical: 'red',
}

const statusMap: Record<string, { color: string; label: string }> = {
  unprocessed: { color: 'red', label: '未处理' },
  processing: { color: 'processing', label: '处理中' },
  processed: { color: 'green', label: '已处理' },
  closed: { color: 'default', label: '已关闭' },
}

function CreateWarningModal({ open, onClose, elderlyId }: { open: boolean; onClose: () => void; elderlyId: string }) {
  const [form] = Form.useForm()
  const createMutation = useCreateHealthWarningMutation()

  const handleSubmit = (values: Record<string, unknown>) => {
    createMutation.mutate(
      {
        ...values,
        elderlyId,
        occurredAt: dayjs(values.occurredAt as string).format('YYYY-MM-DDTHH:mm:ss'),
        status: 'unprocessed',
      } as HealthWarningCreateRequest,
      {
        onSuccess: () => {
          message.success('预警创建成功')
          form.resetFields()
          onClose()
        },
        onError: (err: Error) => {
          message.error(err?.message ?? '创建失败')
        },
      },
    )
  }

  return (
    <PopWindow open={open} onClose={onClose} title="创建健康预警" width={560}>
      <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">
        <div className="grid gap-0 md:grid-cols-2 md:gap-x-4">
          <Form.Item name="warningType" label="预警类型" rules={[{ required: true }]}>
            <Select placeholder="选择类型" options={[
              { value: 'abnormal_heart_rate', label: '心率异常' },
              { value: 'blood_pressure', label: '血压波动' },
              { value: 'blood_sugar', label: '血糖异常' },
              { value: 'sleep', label: '睡眠异常' },
              { value: 'fall', label: '跌倒风险' },
              { value: 'other', label: '其他' },
            ]} />
          </Form.Item>
          <Form.Item name="severity" label="严重程度" rules={[{ required: true }]}>
            <Select placeholder="选择级别" options={[
              { value: 'low', label: '低' },
              { value: 'medium', label: '中' },
              { value: 'high', label: '高' },
              { value: 'critical', label: '严重' },
            ]} />
          </Form.Item>
          <Form.Item name="source" label="来源" rules={[{ required: true }]}>
            <Select placeholder="选择来源" options={[
              { value: 'device', label: '设备' },
              { value: 'manual', label: '人工' },
              { value: 'self_report', label: '自报' },
            ]} />
          </Form.Item>
          <Form.Item name="occurredAt" label="发生时间" rules={[{ required: true }]} getValueFromEvent={(date: dayjs.Dayjs | null) => date?.toISOString()}>
            <DatePicker showTime className="w-full" onChange={(d)=>form.setFieldValue('occurredAt', d) } />
          </Form.Item>
          <Form.Item name="metricName" label="指标名称">
            <Input placeholder="如：心率、收缩压" />
          </Form.Item>
          <Form.Item name="metricValue" label="指标值">
            <InputNumber className="w-full" placeholder="数值" />
          </Form.Item>
          <Form.Item name="thresholdValue" label="阈值">
            <InputNumber className="w-full" placeholder="正常范围上限" />
          </Form.Item>
        </div>
        <Form.Item name="remark" label="备注">
          <TextArea rows={3} placeholder="补充说明..." maxLength={500} showCount />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={createMutation.isPending} block size="large">
          提交预警
        </Button>
      </Form>
    </PopWindow>
  )
}

export default function ElderlyHealthPage() {
  const { data: userData } = useGetCurrentUserQuery()
  const elderlyId = userData?.data?.id ?? ''

  const [createOpen, setCreateOpen] = useState(false)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListHealthWarningsQuery({
    elderlyId: elderlyId || undefined,
    pageSize: 10,
  })

  const allWarnings = useMemo(
    () => data?.pages.flatMap(p => p.data?.list ?? []) ?? [],
    [data],
  )

  const columns = [
    { title: '类型', dataIndex: 'warningType', width: 120, render: (v: string) => <Tag>{v}</Tag> },
    {
      title: '级别', dataIndex: 'severity', width: 80,
      render: (v: string) => <Tag color={severityColors[v] ?? 'default'}>{v}</Tag>,
    },
    { title: '来源', dataIndex: 'source', width: 80 },
    { title: '指标', dataIndex: 'metricName', width: 100, render: (v: string) => v || '-' },
    { title: '指标值', dataIndex: 'metricValue', width: 80, render: (v: number | undefined) => v ?? '-' },
    { title: '阈值', dataIndex: 'thresholdValue', width: 80, render: (v: number | undefined) => v ?? '-' },
    {
      title: '状态', dataIndex: 'status', width: 100,
      render: (v: string) => {
        const s = statusMap[v]
        return s ? <Tag color={s.color}>{s.label}</Tag> : <StatusTag value={v} />
      },
    },
    { title: '发生时间', dataIndex: 'occurredAt', width: 170 },
    { title: '备注', dataIndex: 'remark', ellipsis: true, render: (v: string) => v || '-' },
  ]

  return (
    <div className="space-y-6">
      {/* 顶部操作栏 */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div>
          <div className="text-2xl font-semibold text-slate-900">我的健康预警</div>
          <div className="mt-2 text-sm text-slate-500">查看和提交个人健康预警记录</div>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          创建预警
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: '总预警数', value: allWarnings.length, color: 'bg-cyan-50 text-cyan-700' },
          { label: '未处理', value: allWarnings.filter(w => w.status === 'unprocessed').length, color: 'bg-red-50 text-red-700' },
          { label: '已处理', value: allWarnings.filter(w => w.status === 'processed').length, color: 'bg-green-50 text-green-700' },
        ].map(item => (
          <div key={item.label} className={`rounded-2xl ${item.color} flex items-center gap-4 px-6 py-5`}>
            <WarningOutlined className="text-2xl opacity-60" />
            <div>
              <div className="text-3xl font-bold">{item.value}</div>
              <div className="mt-1 text-sm opacity-70">{item.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 列表 */}
      <PanelCard title="预警记录" subtitle={`共 ${allWarnings.length} 条`}>
        <Table
          rowKey="id"
          loading={isLoading}
          dataSource={allWarnings}
          columns={columns}
          pagination={false}
          scroll={{ x: 1000 }}
          size="middle"
        />
        {hasNextPage && (
          <div className="mt-4 text-center">
            <Button loading={isFetchingNextPage} onClick={() => fetchNextPage()}>
              加载更多
            </Button>
          </div>
        )}
      </PanelCard>

      <CreateWarningModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        elderlyId={elderlyId}
      />
    </div>
  )
}
