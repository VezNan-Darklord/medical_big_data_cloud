import { useLayoutEffect, useMemo, useRef } from 'react'
import { Button } from 'antd'
import gsap from 'gsap'
import EChart from '../components/charts/ECharts'
import { PanelCard } from '../components/common'
import { actionItems, insightItems } from '../mock-data'

export default function DecisionAnalysisPage() {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const cards = containerRef.current.querySelectorAll('[data-insight]')
    gsap.fromTo(cards, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.1, ease: 'power2.out' })
  }, [])

  const radarOption = useMemo(() => ({
    radar: {
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
    series: [{ type: 'radar', data: [{ value: [92, 88, 87, 81, 78], areaStyle: { color: 'rgba(34,211,238,0.22)' }, lineStyle: { color: '#06b6d4' }, itemStyle: { color: '#06b6d4' } }] }],
  }), [])

  const barOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    grid: { left: 16, right: 16, top: 16, bottom: 16, containLabel: true },
    xAxis: { type: 'value', axisLabel: { color: '#64748b' }, splitLine: { lineStyle: { color: '#e2e8f0' } } },
    yAxis: { type: 'category', data: ['南山区', '福田区', '龙华区', '宝安区'], axisLabel: { color: '#64748b' } },
    series: [{ type: 'bar', data: [86, 71, 66, 54], itemStyle: { borderRadius: 8, color: '#818cf8' } }],
  }), [])

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="rounded-[28px] bg-[linear-gradient(135deg,#071122,#0b1f38_55%,#13346b)] p-7 text-white shadow-[0_28px_100px_rgba(8,15,33,0.35)]">
        <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
          <div>
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-cyan-200">AI Spec Ready</div>
            <h2 className="mt-4 text-3xl font-semibold">大数据决策分析</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">这里先按 `train.md` 中的 AI 输入输出 spec 预留展示区，包括摘要、洞察、建议动作、地区对比和能力雷达，后续可直接接 `/ai/analysis/care-decision`。</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['AI 洞察', '05'],
              ['待执行建议', '03'],
              ['高风险区域', '02'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                <div className="text-xs text-slate-300">{label}</div>
                <div className="mt-2 text-3xl font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <PanelCard title="AI 总结" subtitle="care_decision_analysis 场景摘要" dark>
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-base text-white">本周期整体运行平稳，但高风险预警处理及时率与 A 级重点人群随访节奏仍有提升空间。</div>
            <div className="grid gap-4 md:grid-cols-3">
              {insightItems.map((item) => (
                <div key={item.title} data-insight className="rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-medium text-white">{item.title}</div>
                    <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-1 text-xs text-cyan-200">{item.confidence}</div>
                  </div>
                  <div className="mt-3 text-sm text-slate-300">{item.description}</div>
                  <div className="mt-4 text-xs text-slate-400">{item.priority}</div>
                </div>
              ))}
            </div>
          </div>
        </PanelCard>
        <PanelCard title="能力雷达" subtitle="管理能力横截面">
          <EChart option={radarOption} height={350} />
        </PanelCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <PanelCard title="建议动作" subtitle="可直接映射 actions 结构">
          <div className="space-y-4">
            {actionItems.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-medium text-slate-900">{item.title}</div>
                    <div className="mt-1 text-sm text-slate-500">负责人：{item.owner}</div>
                  </div>
                  <Button type="primary" ghost>纳入待办</Button>
                </div>
                <div className="mt-3 text-sm text-slate-600">{item.impact}</div>
              </div>
            ))}
          </div>
        </PanelCard>
        <PanelCard title="区域风险对比" subtitle="按区域分组的高风险人群规模">
          <EChart option={barOption} height={320} />
        </PanelCard>
      </div>
    </div>
  )
}
