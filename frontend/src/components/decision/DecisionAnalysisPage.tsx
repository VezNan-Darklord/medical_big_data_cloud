import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Button, Card, Tag, Skeleton, Drawer, message } from 'antd'
import { PlusOutlined, EyeOutlined, DeleteOutlined, ThunderboltOutlined, RadarChartOutlined, BulbOutlined, AimOutlined } from '@ant-design/icons'
import gsap from 'gsap'
import EChart from '../charts/ECharts'
import { PanelCard, PopWindow } from '../common'
import { useListCareDecisionHistoryQuery, useGetCareDecisionAnalysisQuery, useCreateCareDecisionAnalysisMutation } from '../../../api/hooks/aiAnalysisHooks'
import type { AnalysisResult } from '../../../api/models/AnalysisResult'

function AnalysisCard({ analysis, onView }: { analysis: AnalysisResult; onView: (id: string) => void }) {
  const insightCount = analysis.insights?.length ?? 0
  const actionCount = analysis.actions?.length ?? 0

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm transition hover:shadow-md" styles={{ body: { padding: 20 } }}>
      <div className="flex items-center justify-between">
        <Tag color="purple" icon={<ThunderboltOutlined />}>{analysis.scene ?? '分析'}</Tag>
        <span className="text-xs text-slate-400">{analysis.createdAt?.slice(0, 10) ?? ''}</span>
      </div>
      <div className="mt-3 line-clamp-2 text-sm font-medium text-slate-800">{analysis.summary ?? '暂无摘要'}</div>
      <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
        <span><BulbOutlined className="mr-1 text-amber-500" />{insightCount} 条洞察</span>
        <span><AimOutlined className="mr-1 text-cyan-500" />{actionCount} 条建议</span>
      </div>
      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
        <Button size="small" type="primary" ghost icon={<EyeOutlined />} onClick={() => onView(analysis.id!)} block>查看详情</Button>
        <Button size="small" danger icon={<DeleteOutlined />} disabled title="删除接口未开放" />
      </div>
    </Card>
  )
}

function AnalysisDetailDrawer({ id, open, onClose }: { id: string; open: boolean; onClose: () => void }) {
  const { data, isLoading } = useGetCareDecisionAnalysisQuery(id)
  const analysis = data?.data

  const radarOption = useMemo(() => ({
    radar: {
      center: ['50%', '55%'],
      radius: '65%',
      indicator: [
        { name: '预警闭环', max: 100 },
        { name: '设备覆盖', max: 100 },
        { name: '随访达成', max: 100 },
        { name: '报告产出', max: 100 },
        { name: '机构响应', max: 100 },
      ],
      splitLine: { lineStyle: { color: 'rgba(148,163,184,0.24)' } },
      splitArea: { areaStyle: { color: ['rgba(14,165,233,0.02)', 'rgba(14,165,233,0.05)'] } },
    },
    series: [{ type: 'radar', data: [{ value: [92, 88, 87, 81, 78], areaStyle: { color: 'rgba(34,211,238,0.18)' }, lineStyle: { color: '#06b6d4' }, itemStyle: { color: '#06b6d4' } }] }],
  }), [])

  if (!open) return null

  return (
    <Drawer title={<div className="flex items-center gap-2"><RadarChartOutlined className="text-cyan-600" />分析详情</div>} open={open} onClose={onClose} width={700}>
      {isLoading ? <Skeleton active paragraph={{ rows: 10 }} /> :
       !analysis ? <div className="py-10 text-center text-slate-400">未找到分析记录</div> : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-semibold text-slate-700 mb-2">综合摘要</div>
            <div className="text-sm leading-7 text-slate-600">{analysis.summary}</div>
          </div>

          {analysis.insights && analysis.insights.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-3">AI 洞察</div>
              <div className="space-y-3">
                {analysis.insights.map((insight, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center justify-between">
                      <Tag color={insight.type === 'risk' ? 'red' : 'blue'}>{insight.type}</Tag>
                      <span className="text-xs text-slate-400">置信度 {((insight.confidence ?? 0) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="mt-2 font-medium text-slate-900">{insight.title}</div>
                    <div className="mt-1 text-sm text-slate-600">{insight.description}</div>
                    {insight.suggestion && (
                      <div className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800"><BulbOutlined className="mr-1" />{insight.suggestion}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.actions && analysis.actions.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-slate-700 mb-3">建议动作</div>
              <div className="space-y-3">
                {analysis.actions.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-50 text-cyan-600"><AimOutlined /></div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{action.actionType}</div>
                      <div className="mt-1 text-sm text-slate-500">目标：{action.target} · 优先级：<Tag color={action.priority === 'high' ? 'red' : 'orange'}>{action.priority}</Tag></div>
                      <div className="mt-1 text-sm text-slate-600">{action.expectedEffect}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <PanelCard title={<span className="text-slate-700">能力雷达</span>} subtitle="管理能力横截面">
            <EChart option={radarOption} height={320} />
          </PanelCard>
        </div>
      )}
    </Drawer>
  )
}

function CreateAnalysisModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const createMutation = useCreateCareDecisionAnalysisMutation()

  return (
    <PopWindow open={open} onClose={onClose} title="生成决策分析" width={440}>
      <div className="text-sm text-slate-500 mb-4">系统将根据当前全局指标自动生成照护决策分析结果，并持久化到历史记录中。</div>
      <Button type="primary" block size="large" icon={<ThunderboltOutlined />}
        loading={createMutation.isPending}
        onClick={() => createMutation.mutate({
          scene: 'care_decision_analysis',
          metrics: { elderlyCount: 1280, warningCount: 12, unhandledWarningCount: 4, highRiskPopulationCount: 86, deviceOnlineRate: 0.93 },
          constraints: { language: 'zh-CN', maxInsightCount: 5 },
        }, { onSuccess: () => { message.success('分析已生成'); onClose() }, onError: (err: Error) => message.error(err?.message ?? '生成失败') })}
      >
        立即生成
      </Button>
    </PopWindow>
  )
}

export default function DecisionAnalysisPage() {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [detailId, setDetailId] = useState('')
  const [createOpen, setCreateOpen] = useState(false)

  const { data, isLoading } = useListCareDecisionHistoryQuery()
  const allAnalyses: AnalysisResult[] = (data?.data as AnalysisResult[]) ?? []

  useLayoutEffect(() => {
    if (!containerRef.current || allAnalyses.length === 0) return
    const cards = containerRef.current.querySelectorAll('[data-insight]')
    if (cards.length > 0) {
      gsap.fromTo(cards, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power2.out' })
    }
  }, [allAnalyses])

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="rounded-[28px] bg-[linear-gradient(135deg,#071122,#0b1f38_55%,#13346b)] p-7 text-white shadow-[0_28px_100px_rgba(8,15,33,0.35)]">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cyan-200">AI Decision Engine</div>
            <h2 className="mt-4 text-3xl font-semibold">大数据决策分析</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">基于业务规则引擎生成照护决策分析，包含洞察、建议动作和趋势评估。</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3" data-insight>
            {[
              ['分析记录', String(allAnalyses.length)],
              ['今日洞察', String(allAnalyses.flatMap(a => a.insights ?? []).length)],
              ['建议动作', String(allAnalyses.flatMap(a => a.actions ?? []).length)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                <div className="text-xs text-slate-300">{label}</div>
                <div className="mt-2 text-3xl font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-500">共 {allAnalyses.length} 条分析记录</div>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>生成分析</Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Card key={i} loading className="rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allAnalyses.map(a => <AnalysisCard key={a.id} analysis={a} onView={setDetailId} />)}
        </div>
      )}

      <CreateAnalysisModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <AnalysisDetailDrawer id={detailId} open={!!detailId} onClose={() => setDetailId('')} />
    </div>
  )
}
