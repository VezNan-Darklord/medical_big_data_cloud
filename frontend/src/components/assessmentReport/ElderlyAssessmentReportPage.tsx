import { useState, useMemo } from 'react'
import { Button, Card, Descriptions, Drawer, Empty, Skeleton, Spin, Tag } from 'antd'
import { EyeOutlined, MedicineBoxOutlined } from '@ant-design/icons'
import { useGetMyAssessmentReportsQuery } from '../../../api/hooks/profileHooks'
import { useIntersectionObserver } from '../common/useIntersectionObserver'
import type { AssessmentReport } from '../../../api/models/AssessmentReport'

const gradeColors: Record<string, string> = { A: 'green', B: 'blue', C: 'orange', D: 'red' }
const reviewStatusMap: Record<string, { color: string; label: string }> = {
  draft: { color: 'default', label: '草稿' },
  approved: { color: 'green', label: '已审核' },
  rejected: { color: 'red', label: '已退回' },
}

function ReportCard({ report, onView }: { report: AssessmentReport; onView: (id: string) => void }) {
  return (
    <Card
      hoverable
      className="overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm transition hover:shadow-md"
      styles={{ body: { padding: 20 } }}
      onClick={() => onView(report.id)}
    >
      <div className="flex items-center justify-between">
        <Tag color="processing">{report.reportType}</Tag>
        <div className="flex items-center gap-2">
          <Tag color={gradeColors[report.grade] ?? 'default'}>{report.grade}</Tag>
          <span className="text-lg font-bold text-slate-700">{report.score}</span>
        </div>
      </div>
      <div className="mt-3 line-clamp-2 text-sm text-slate-600">{report.summary}</div>
      <div className="mt-3 flex flex-wrap gap-1">
        {report.riskItems.slice(0, 3).map(r => <Tag key={r} color="red">{r}</Tag>)}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{report.assessedAt?.slice(0, 10)}</span>
          {report.reviewStatus && (
            <Tag color={reviewStatusMap[report.reviewStatus]?.color}>
              {reviewStatusMap[report.reviewStatus]?.label ?? report.reviewStatus}
            </Tag>
          )}
        </div>
        <Button size="small" icon={<EyeOutlined />}>详情</Button>
      </div>
    </Card>
  )
}

function ReportDetailDrawer({ id, open, onClose }: { id: string; open: boolean; onClose: () => void }) {
  const allPages = useGetMyAssessmentReportsQuery({ pageSize: 100 })
  const allReports: AssessmentReport[] = useMemo(
    () => allPages.data?.pages.flatMap(p => ((p.data)?.list ?? []) as AssessmentReport[]) ?? [],
    [allPages.data],
  )
  const report = allReports.find(r => r.id === id) ?? null

  if (!open) return null

  return (
    <Drawer
      title={<div className="flex items-center gap-3"><MedicineBoxOutlined className="text-cyan-600" />评估报告详情</div>}
      open={open} onClose={onClose} width={600}
    >
      {!report ? <Empty description="未找到报告" /> : (
        <div className="space-y-6">
          <Descriptions column={2} size="middle" colon={false}>
            <Descriptions.Item label="报告类型">{report.reportType}</Descriptions.Item>
            <Descriptions.Item label="评分 / 等级">
              <span className="text-lg font-bold">{report.score}</span>
              <Tag color={gradeColors[report.grade]} className="ml-2">{report.grade}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="评估时间">{report.assessedAt?.slice(0, 10)}</Descriptions.Item>
            <Descriptions.Item label="审核状态">
              <Tag color={reviewStatusMap[report.reviewStatus]?.color}>
                {reviewStatusMap[report.reviewStatus]?.label ?? report.reviewStatus}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 text-sm font-semibold text-slate-700">综合评估</div>
            <div className="text-sm leading-7 text-slate-600">{report.summary}</div>
          </div>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-800">病症与风险项</h3>
            <div className="flex flex-wrap gap-2">{report.riskItems.map(item => <Tag key={item} color="red">{item}</Tag>)}</div>
          </section>

          <section>
            <h3 className="mb-2 text-sm font-semibold text-slate-800">用药建议与后续动作</h3>
            <ol className="space-y-2">
              {report.recommendations.map((item, index) => (
                <li key={`${index}-${item}`} className="rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
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

export default function ElderlyAssessmentReportPage() {
  const [detailId, setDetailId] = useState('')
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetMyAssessmentReportsQuery({ pageSize: 20 })
  const allReports: AssessmentReport[] = useMemo(
    () => data?.pages.flatMap(p => ((p.data)?.list ?? []) as AssessmentReport[]) ?? [],
    [data],
  )

  const sentinelRef = useIntersectionObserver(
    () => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() },
    !isLoading,
  )

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div className="text-2xl font-semibold text-slate-900">我的评估报告</div>
        <div className="mt-2 text-sm text-slate-500">共 {allReports.length} 份报告</div>
      </div>

      {isLoading ? <Skeleton active paragraph={{ rows: 8 }} /> : allReports.length === 0 ? (
        <Empty description="暂无评估报告" />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allReports.map(report => <ReportCard key={report.id} report={report} onView={setDetailId} />)}
          </div>
          <div ref={sentinelRef} className="h-px" />
          {isFetchingNextPage && <div className="text-center"><Spin /></div>}
        </>
      )}

      <ReportDetailDrawer id={detailId} open={!!detailId} onClose={() => setDetailId('')} />
    </div>
  )
}
