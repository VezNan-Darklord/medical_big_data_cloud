import { useState } from 'react'
import { Button, Card, Tag, Descriptions, Drawer } from 'antd'
import { PlusOutlined, EyeOutlined, MedicineBoxOutlined } from '@ant-design/icons'
import { useIntersectionObserver } from '../common/useIntersectionObserver'

interface MockReport {
  id: string
  elderlyId: string
  elderlyName: string
  reportType: string
  score: number
  grade: string
  summary: string
  riskItems: string[]
  recommendations: string[]
  assessorName: string
  assessedAt: string
}

const MOCK_REPORTS: MockReport[] = [
  {
    id: 'r1', elderlyId: 'e001', elderlyName: '张三', reportType: '健康评估',
    score: 82, grade: 'B', summary: '整体情况稳定，血压偏高需持续关注控制。',
    riskItems: ['血压偏高', '睡眠不足', '心律不齐'],
    recommendations: ['硝苯地平 30mg qd 口服', '阿司匹林 100mg qd 口服', '每周复测血压 2 次', '增加有氧运动每周 3 次', '低盐低脂饮食'],
    assessorName: '李医生', assessedAt: '2026-07-11',
  },
  {
    id: 'r2', elderlyId: 'e002', elderlyName: '李秀芳', reportType: '用药评估',
    score: 88, grade: 'A', summary: '血糖控制良好，维持当前方案。',
    riskItems: ['偶发低血糖'],
    recommendations: ['二甲双胍 0.5g bid 口服', '阿卡波糖 50mg tid 随餐', '注意餐后 2h 血糖监测', '随身携带糖果防低血糖'],
    assessorName: '陈医生', assessedAt: '2026-07-10',
  },
  {
    id: 'r3', elderlyId: 'e003', elderlyName: '王建国', reportType: '康复评估',
    score: 74, grade: 'C', summary: '下肢肌力不足，步态不稳，建议强化康复训练。',
    riskItems: ['跌倒风险', '肌少症', '关节僵硬'],
    recommendations: ['步态训练每日 30min', '下肢抗阻训练每周 3 次', '补充维生素 D 800IU qd', '钙片 600mg qd'],
    assessorName: '周医生', assessedAt: '2026-07-09',
  },
  {
    id: 'r4', elderlyId: 'e004', elderlyName: '何桂兰', reportType: '健康评估',
    score: 91, grade: 'A', summary: '各项指标均在正常范围，继续保持。',
    riskItems: ['轻度骨质疏松'],
    recommendations: ['钙尔奇 D 600mg qd 口服', '福善美 70mg qw 口服', '每日户外日照 30min'],
    assessorName: '李医生', assessedAt: '2026-07-08',
  },
  {
    id: 'r5', elderlyId: 'e001', elderlyName: '张三', reportType: '睡眠评估',
    score: 68, grade: 'D', summary: '睡眠质量差，夜间觉醒频繁。',
    riskItems: ['失眠', '焦虑状态'],
    recommendations: ['艾司唑仑 1mg qn 睡前口服（短期）', '睡眠卫生教育', '限制午睡不超过 30min', '睡前 1h 停止使用电子设备'],
    assessorName: '吴医生', assessedAt: '2026-07-07',
  },
  {
    id: 'r6', elderlyId: 'e002', elderlyName: '李秀芳', reportType: '健康评估',
    score: 85, grade: 'B', summary: '血压偶有波动，整体趋势向好。',
    riskItems: ['血压波动'],
    recommendations: ['氨氯地平 5mg qd 口服', '每日早晚自测血压记录', '限盐 < 5g/天'],
    assessorName: '陈医生', assessedAt: '2026-07-06',
  },
]

const gradeColors: Record<string, string> = { A: 'green', B: 'blue', C: 'orange', D: 'red' }

function ReportCard({ report, onView }: { report: MockReport; onView: (id: string) => void }) {
  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm transition hover:shadow-md" styles={{ body: { padding: 20 } }}>
      <div className="flex items-center justify-between">
        <Tag color="processing">{report.reportType}</Tag>
        <div className="flex items-center gap-2">
          <Tag color={gradeColors[report.grade] ?? 'default'}>{report.grade}</Tag>
          <span className="text-lg font-bold text-slate-700">{report.score}</span>
        </div>
      </div>
      <div className="mt-3">
        <div className="text-sm text-slate-500">老人：{report.elderlyName}</div>
        <div className="mt-2 line-clamp-2 text-sm text-slate-600">{report.summary}</div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {report.riskItems.slice(0, 3).map(r => <Tag key={r} color="red">{r}</Tag>)}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-400">{report.assessorName} · {report.assessedAt}</span>
        <Button size="small" icon={<EyeOutlined />} onClick={() => onView(report.id)}>详情</Button>
      </div>
    </Card>
  )
}

function ReportDetailDrawer({ report, open, onClose }: { report: MockReport | null; open: boolean; onClose: () => void }) {
  if (!report) return null

  return (
    <Drawer title={<div className="flex items-center gap-3"><MedicineBoxOutlined className="text-cyan-600" />评估报告详情</div>} open={open} onClose={onClose} width={600}>
      <div className="space-y-6">
        <Descriptions column={2} size="middle" colon={false}>
          <Descriptions.Item label="报告类型">{report.reportType}</Descriptions.Item>
          <Descriptions.Item label="评分 / 等级">
            <span className="font-bold text-lg">{report.score}</span>
            <Tag color={gradeColors[report.grade]} className="ml-2">{report.grade}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="老人">{report.elderlyName}</Descriptions.Item>
          <Descriptions.Item label="评估人">{report.assessorName}</Descriptions.Item>
          <Descriptions.Item label="评估时间">{report.assessedAt}</Descriptions.Item>
        </Descriptions>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="text-sm font-semibold text-slate-700 mb-2">综合评估</div>
          <div className="text-sm leading-7 text-slate-600">{report.summary}</div>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-700 mb-3">识别风险项</div>
          <div className="flex flex-wrap gap-2">
            {report.riskItems.map(r => <Tag key={r} color="red">{r}</Tag>)}
          </div>
        </div>

        <div>
          <div className="text-sm font-semibold text-slate-700 mb-3">用药建议与后续动作</div>
          <div className="space-y-2">
            {report.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-50 text-xs font-bold text-cyan-600">{idx + 1}</div>
                <div className="text-sm text-slate-700">{rec}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default function AssessmentReportPage() {
  const [detailReport, setDetailReport] = useState<MockReport | null>(null)

  const allReports: MockReport[] = MOCK_REPORTS
  const sentinelRef = useIntersectionObserver(() => {}, false)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div><div className="text-2xl font-semibold text-slate-900">评估报告</div><div className="mt-2 text-sm text-slate-500">共 {allReports.length} 份报告</div></div>
        <Button type="primary" size="large" icon={<PlusOutlined />} disabled title="后端接口重构中">创建报告</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allReports.map(r => <ReportCard key={r.id} report={r} onView={() => setDetailReport(r)} />)}
      </div>
      <div ref={sentinelRef} className="h-px" />

      <ReportDetailDrawer report={detailReport} open={!!detailReport} onClose={() => setDetailReport(null)} />
    </div>
  )
}
