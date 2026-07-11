import { useLayoutEffect, useMemo, useRef } from 'react'
import { ArrowRightOutlined } from '@ant-design/icons'
import { Button, Table } from 'antd'
import gsap from 'gsap'
import EChart from '../charts/ECharts'
import { MetricCard, MiniProgress, PanelCard, StatusTag } from '../common'
import { dashboardMetrics, elderlyRows, todoItems, trendDates } from '../../mock-data'

export default function DashboardPage() {
  const heroRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!heroRef.current) return
    const cards = heroRef.current.querySelectorAll('[data-animate]')
    gsap.fromTo(cards, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out' })
  }, [])

  const trendOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 24, right: 16, top: 30, bottom: 24, containLabel: true },
    xAxis: { type: 'category', data: trendDates, axisLine: { lineStyle: { color: '#334155' } }, axisLabel: { color: '#94a3b8' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: 'rgba(148,163,184,0.16)' } }, axisLabel: { color: '#94a3b8' } },
    series: [
      { name: '老人建档', type: 'line', smooth: true, data: [120, 128, 132, 140, 152, 160, 168], lineStyle: { color: '#22d3ee', width: 3 }, areaStyle: { color: 'rgba(34,211,238,0.18)' }, showSymbol: false },
      { name: '预警处置', type: 'line', smooth: true, data: [64, 72, 68, 76, 81, 84, 89], lineStyle: { color: '#818cf8', width: 3 }, areaStyle: { color: 'rgba(129,140,248,0.12)' }, showSymbol: false },
    ],
  }), [])

  const severityOption = useMemo(() => ({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#64748b' } },
    series: [{ type: 'pie', radius: ['48%', '72%'], avoidLabelOverlap: true, label: { color: '#475569' }, data: [
      { value: 12, name: '高风险', itemStyle: { color: '#fb7185' } },
      { value: 18, name: '中风险', itemStyle: { color: '#f59e0b' } },
      { value: 31, name: '低风险', itemStyle: { color: '#38bdf8' } },
    ] }],
  }), [])

  const deviceOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 16, right: 16, top: 24, bottom: 24, containLabel: true },
    xAxis: { type: 'category', data: trendDates, axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', axisLabel: { color: '#64748b' }, splitLine: { lineStyle: { color: '#e2e8f0' } } },
    series: [{ type: 'bar', data: [89, 91, 92, 90, 94, 95, 93], itemStyle: { borderRadius: [6, 6, 0, 0], color: '#06b6d4' } }],
  }), [])

  return (
    <div ref={heroRef} className="space-y-6">
      <div data-animate className="relative overflow-hidden rounded-[28px] bg-[#071122] px-8 py-8 text-white shadow-[0_30px_90px_rgba(2,6,23,0.35)]">
        <div className="absolute -right-10 top-0 h-52 w-52 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="absolute right-24 top-10 h-28 w-28 rounded-full border border-cyan-300/30 bg-white/5" />
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-5">
            <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200">Cloud Care Intelligence Center</div>
            <div>
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-white">把医养后台先搭成一套能工作的指挥席。</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">当前先不接入接口，按照 OpenAPI 结构和业务文档建立页面骨架、模块路由、信息密度和交互层级，后续可以直接挂真实接口。</p>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {dashboardMetrics.map((item) => <MetricCard key={item.label} {...item} />)}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="text-sm text-slate-300">AI 摘要</div>
              <div className="mt-3 text-xl font-medium">高风险预警处理及时率仍有提升空间</div>
              <div className="mt-3 text-sm leading-7 text-slate-300">建议优先提高慢病老人复测频率，并对夜间离线设备建立 2 小时巡检机制。</div>
              <Button type="primary" className="mt-5 rounded-xl" icon={<ArrowRightOutlined />}>查看分析</Button>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-slate-300">值班状态</div>
                  <div className="mt-2 text-2xl font-semibold">7 x 24</div>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">稳定</div>
              </div>
              <div className="mt-5 space-y-4">
                <MiniProgress label="预警闭环率" value={92} />
                <MiniProgress label="设备在线率" value={93} />
                <MiniProgress label="重点人群随访达成" value={87} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div data-animate className="space-y-6">
          <PanelCard title="运营趋势" subtitle="老人建档与预警处置近 7 日走势" dark>
            <EChart option={trendOption} height={320} />
          </PanelCard>
          <div className="grid gap-6 lg:grid-cols-2">
            <PanelCard title="重点老人档案" subtitle="根据 ElderlyProfile 结构整理字段">
              <Table pagination={false} size="small" rowKey="key" dataSource={elderlyRows} columns={[
                { title: '姓名', dataIndex: 'name' },
                { title: '年龄', dataIndex: 'age' },
                { title: '护理级别', dataIndex: 'careLevel' },
                { title: '状态', dataIndex: 'status', render: (value: string) => <StatusTag value={value} /> },
              ]} />
            </PanelCard>
            <PanelCard title="待办事项" subtitle="个人中心 / 我的待办预览">
              <div className="space-y-4">
                {todoItems.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-medium text-slate-900">{item.title}</div>
                        <div className="mt-1 text-sm text-slate-500">{item.meta}</div>
                      </div>
                      <StatusTag value={item.status === '紧急' ? 'unprocessed' : item.status === '处理中' ? 'processing' : 'watching'} />
                    </div>
                  </div>
                ))}
              </div>
            </PanelCard>
          </div>
        </div>
        <div data-animate className="space-y-6">
          <PanelCard title="预警等级分布" subtitle="HealthWarning.severity">
            <EChart option={severityOption} height={260} />
          </PanelCard>
          <PanelCard title="设备在线趋势" subtitle="Device.onlineStatus / lastReportAt">
            <EChart option={deviceOption} height={260} />
          </PanelCard>
          <PanelCard title="值班快照" subtitle="重点模块实时概况">
            <div className="space-y-4">
              {[
                ['高风险预警', '4 条待处置'],
                ['重点人群', 'A 级 21 人'],
                ['离线设备', '2 台需巡检'],
                ['今日评估报告', '12 份已生成'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="font-medium text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  )
}
