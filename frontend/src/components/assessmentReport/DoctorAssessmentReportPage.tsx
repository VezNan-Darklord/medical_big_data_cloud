import { useMemo, useState } from 'react'
import {
  Button,
  Card,
  DatePicker,
  Descriptions,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Skeleton,
  Tag,
  message,
} from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import dayjs, { type Dayjs } from 'dayjs'
import {
  useListAssessmentReportsQuery,
  useCreateAssessmentReportMutation,
  useDeleteAssessmentReportMutation,
  useExportAssessmentReportMutation,
  useUpdateAssessmentReportMutation,
} from '../../../api/hooks/assessmentReportHooks'
import { downloadBlob } from '../../../api/download'
import { useListElderlyProfilesQuery } from '../../../api/hooks/elderlyProfileHooks'
import type { AssessmentReport } from '../../../api/models/AssessmentReport'
import type { AssessmentReportCreateRequest } from '../../../api/models/AssessmentReportCreateRequest'
import type { AssessmentReportUpdateRequest } from '../../../api/models/AssessmentReportUpdateRequest'

const gradeColors: Record<string, string> = { A: 'green', B: 'blue', C: 'orange', D: 'red' }
const reportTypes: AssessmentReportCreateRequest['reportType'][] =
  ['健康评估', '康复评估', '用药评估', '睡眠评估']

type ReportFormValues = Omit<AssessmentReportCreateRequest, 'assessedAt'> & {
  assessedAt: Dayjs
}

function ReportFormModal({
  open,
  onClose,
  report,
}: {
  open: boolean
  onClose: () => void
  report: AssessmentReport | null
}) {
  const [form] = Form.useForm<ReportFormValues>()
  const createMutation = useCreateAssessmentReportMutation()
  const updateMutation = useUpdateAssessmentReportMutation()
  const elderlyQuery = useListElderlyProfilesQuery({ pageSize: 100 })
  const elderlyProfiles = elderlyQuery.data?.pages.flatMap(page => page.data?.list ?? []) ?? []

  const submit = (values: ReportFormValues) => {
    const callbacks = {
      onSuccess: () => {
        message.success(report ? '评估报告已修改，复核状态已重置为草稿' : '评估报告已创建')
        form.resetFields()
        onClose()
      },
      onError: (error: Error) => message.error(error.message || (report ? '修改报告失败' : '创建报告失败')),
    }

    if (report) {
      const request: AssessmentReportUpdateRequest = {
        reportType: values.reportType,
        score: values.score,
        grade: values.grade,
        summary: values.summary,
        riskItems: values.riskItems,
        recommendations: values.recommendations,
        assessedAt: values.assessedAt.toISOString(),
      }
      updateMutation.mutate({ id: report.id, ...request }, callbacks)
      return
    }

    createMutation.mutate(
      { ...values, assessedAt: values.assessedAt.toISOString() },
      callbacks,
    )
  }

  return (
    <Modal
      title={report ? '修改评估报告' : '创建评估报告'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={createMutation.isPending || updateMutation.isPending}
      width={720}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={submit}
        initialValues={report ? {
          elderlyId: report.elderlyId,
          reportType: report.reportType,
          score: report.score,
          grade: report.grade,
          summary: report.summary,
          riskItems: report.riskItems,
          recommendations: report.recommendations,
          assessedAt: dayjs(report.assessedAt),
        } : {
          reportType: '健康评估',
          grade: 'B',
          score: 80,
          assessedAt: dayjs(),
        }}
      >
        <div className="grid gap-x-4 md:grid-cols-2">
          <Form.Item name="elderlyId" label="老人档案" rules={[{ required: true }]}>
            <Select
              disabled={Boolean(report)}
              showSearch
              loading={elderlyQuery.isLoading}
              optionFilterProp="label"
              options={elderlyProfiles.map(profile => ({
                value: profile.id!,
                label: `${profile.name} (${profile.id})`,
              }))}
            />
          </Form.Item>
          <Form.Item name="reportType" label="报告类型" rules={[{ required: true }]}>
            <Select options={reportTypes.map(value => ({ value, label: value }))} />
          </Form.Item>
          <Form.Item name="score" label="评分" rules={[{ required: true }]}>
            <InputNumber min={0} max={100} className="w-full" />
          </Form.Item>
          <Form.Item name="grade" label="等级" rules={[{ required: true }]}>
            <Select options={['A', 'B', 'C', 'D'].map(value => ({ value, label: value }))} />
          </Form.Item>
          <Form.Item name="assessedAt" label="评估时间" rules={[{ required: true }]}>
            <DatePicker showTime className="w-full" />
          </Form.Item>
        </div>
        <Form.Item name="summary" label="综合评估结论" rules={[{ required: true }]}>
          <Input.TextArea rows={4} maxLength={2000} showCount />
        </Form.Item>
        <Form.Item name="riskItems" label="病症与风险项" rules={[{ required: true }]}>
          <Select mode="tags" tokenSeparators={[',', '，']} maxCount={20} />
        </Form.Item>
        <Form.Item name="recommendations" label="用药建议与后续动作" rules={[{ required: true }]}>
          <Select mode="tags" tokenSeparators={[',', '，']} maxCount={30} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

function ReportCard({
  report,
  onEdit,
  onView,
}: {
  report: AssessmentReport
  onEdit: (report: AssessmentReport) => void
  onView: (report: AssessmentReport) => void
}) {
  const deleteMutation = useDeleteAssessmentReportMutation()
  const exportMutation = useExportAssessmentReportMutation()

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm" styles={{ body: { padding: 20 } }}>
      <div className="flex items-center justify-between">
        <Tag color="processing">{report.reportType}</Tag>
        <div className="flex items-center gap-2">
          <Tag color={gradeColors[report.grade]}>{report.grade}</Tag>
          <span className="text-lg font-bold text-slate-700">{report.score}</span>
        </div>
      </div>
      <div className="mt-3 text-xs text-slate-400">档案 ID：{report.elderlyId}</div>
      <div className="mt-2 line-clamp-3 min-h-[60px] text-sm leading-5 text-slate-600">{report.summary}</div>
      <div className="mt-3 flex min-h-6 flex-wrap gap-1">
        {report.riskItems.slice(0, 3).map(item => <Tag key={item} color="red">{item}</Tag>)}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-400">{dayjs(report.assessedAt).format('YYYY-MM-DD HH:mm')}</span>
        <div className="flex gap-1">
          <Button size="small" icon={<EditOutlined />} onClick={() => onEdit(report)} />
          <Button size="small" icon={<EyeOutlined />} onClick={() => onView(report)} />
          <Button
            size="small"
            icon={<DownloadOutlined />}
            loading={exportMutation.isPending}
            onClick={() => exportMutation.mutate(report.id, {
              onSuccess: blob => downloadBlob(blob, `assessment-report-${report.id}.md`),
              onError: (error: Error) => message.error(error.message || '导出失败'),
            })}
          />
          <Popconfirm
            title="确认删除这份报告？"
            onConfirm={() => deleteMutation.mutate(report.id, {
              onSuccess: () => message.success('报告已删除'),
              onError: (error: Error) => message.error(error.message || '删除失败'),
            })}
          >
            <Button size="small" danger icon={<DeleteOutlined />} loading={deleteMutation.isPending} />
          </Popconfirm>
        </div>
      </div>
    </Card>
  )
}

function ReportDetailDrawer({
  report,
  onClose,
}: {
  report: AssessmentReport | null
  onClose: () => void
}) {
  return (
    <Drawer
      title={<div className="flex items-center gap-2"><MedicineBoxOutlined className="text-cyan-600" />评估报告详情</div>}
      open={Boolean(report)}
      onClose={onClose}
      width={620}
    >
      {report && (
        <div className="space-y-6">
          <Descriptions column={2} colon={false}>
            <Descriptions.Item label="报告类型">{report.reportType}</Descriptions.Item>
            <Descriptions.Item label="评分 / 等级">
              <span className="font-bold">{report.score}</span>
              <Tag className="ml-2" color={gradeColors[report.grade]}>{report.grade}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="老人档案">{report.elderlyId}</Descriptions.Item>
            <Descriptions.Item label="评估人">{report.assessorId}</Descriptions.Item>
            <Descriptions.Item label="评估时间">{dayjs(report.assessedAt).format('YYYY-MM-DD HH:mm')}</Descriptions.Item>
            <Descriptions.Item label="复核状态">{report.reviewStatus}</Descriptions.Item>
          </Descriptions>
          <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-800">综合评估结论</h3>
            <p className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">{report.summary}</p>
          </section>
          <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-800">病症与风险项</h3>
            <div className="flex flex-wrap gap-2">{report.riskItems.map(item => <Tag key={item} color="red">{item}</Tag>)}</div>
          </section>
          <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-800">用药建议与后续动作</h3>
            <ol className="space-y-2">
              {report.recommendations.map((item, index) => (
                <li key={`${index}-${item}`} className="rounded-xl border border-slate-200 p-3 text-sm text-slate-700">
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
          </section>
        </div>
      )}
    </Drawer>
  )
}

export default function AssessmentReportPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editingReport, setEditingReport] = useState<AssessmentReport | null>(null)
  const [detailReport, setDetailReport] = useState<AssessmentReport | null>(null)
  const reportsQuery = useListAssessmentReportsQuery()
  const reports = useMemo(
    () => reportsQuery.data?.pages.flatMap(page => page.data?.list ?? []) ?? [],
    [reportsQuery.data],
  )
  const total = reportsQuery.data?.pages[0]?.data?.total ?? 0

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div>
          <div className="text-2xl font-semibold text-slate-900">评估报告</div>
          <div className="mt-2 text-sm text-slate-500">共 {total} 份报告</div>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>创建报告</Button>
      </div>

      {reportsQuery.isLoading ? <Skeleton active paragraph={{ rows: 8 }} /> : reports.length === 0 ? (
        <Empty description="暂无评估报告" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reports.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              onEdit={setEditingReport}
              onView={setDetailReport}
            />
          ))}
        </div>
      )}

      <ReportFormModal open={createOpen} onClose={() => setCreateOpen(false)} report={null} />
      {editingReport && (
        <ReportFormModal
          key={editingReport.id}
          open
          report={editingReport}
          onClose={() => setEditingReport(null)}
        />
      )}
      <ReportDetailDrawer report={detailReport} onClose={() => setDetailReport(null)} />
    </div>
  )
}
