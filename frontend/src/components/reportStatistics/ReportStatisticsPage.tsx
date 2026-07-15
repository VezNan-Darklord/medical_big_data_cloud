import { useMemo } from 'react'
import EChart from '../charts/ECharts'
import { PanelCard } from '../common'

const STATS = {
  totalElderlyCount: 1280,
  totalDoctorCount: 96,
  totalDeviceCount: 642,
  unboundDeviceCount: 49,
  deviceOnlineRate: 0.93,
  totalWarningCount: 31,
  unhandledWarningCount: 4,
}

const statCards = [
  { label: '在档老人', value: STATS.totalElderlyCount.toLocaleString(), color: 'from-cyan-50 to-sky-50 border-cyan-200 text-cyan-700' },
  { label: '医生总数', value: String(STATS.totalDoctorCount), color: 'from-blue-50 to-indigo-50 border-blue-200 text-blue-700' },
  { label: '设备总数', value: String(STATS.totalDeviceCount), color: 'from-violet-50 to-purple-50 border-violet-200 text-violet-700' },
  { label: '未关联设备', value: String(STATS.unboundDeviceCount), color: 'from-orange-50 to-amber-50 border-orange-200 text-orange-700' },
  { label: '设备在线率', value: `${(STATS.deviceOnlineRate * 100).toFixed(1)}%`, color: 'from-emerald-50 to-green-50 border-emerald-200 text-emerald-700' },
  { label: '未处理预警', value: String(STATS.unhandledWarningCount), color: 'from-rose-50 to-red-50 border-rose-200 text-rose-700' },
]

export default function ReportStatisticsPage() {
  const populationTrendOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#64748b' } },
    grid: { left: 24, right: 16, top: 30, bottom: 40, containLabel: true },
    xAxis: { type: 'category', data: ['01月','02月','03月','04月','05月','06月'], axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#e2e8f0' } }, axisLabel: { color: '#64748b' } },
    series: [
      { name: '慢病高风险', type: 'line', smooth: true, data: [35, 37, 39, 38, 40, 42], lineStyle: { color: '#fb7185', width: 3 }, symbol: 'circle', symbolSize: 6 },
      { name: '跌倒高风险', type: 'line', smooth: true, data: [15, 16, 18, 19, 18, 21], lineStyle: { color: '#f59e0b', width: 3 }, symbol: 'circle', symbolSize: 6 },
      { name: '认知关注', type: 'line', smooth: true, data: [10, 10, 11, 12, 11, 13], lineStyle: { color: '#818cf8', width: 3 }, symbol: 'circle', symbolSize: 6 },
    ],
  }), [])

  const elderlyTrendOption = useMemo(() => ({
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0, textStyle: { color: '#64748b' } },
    grid: { left: 24, right: 16, top: 30, bottom: 40, containLabel: true },
    xAxis: { type: 'category', data: ['01月','02月','03月','04月','05月','06月'], axisLabel: { color: '#64748b' } },
    yAxis: { type: 'value', splitLine: { lineStyle: { color: '#e2e8f0' } }, axisLabel: { color: '#64748b' } },
    series: [
      { name: '新增建档', type: 'line', smooth: true, data: [42, 38, 55, 41, 48, 52], lineStyle: { color: '#06b6d4', width: 3 }, areaStyle: { color: 'rgba(6,182,212,0.12)' }, symbol: 'circle', symbolSize: 6 },
      { name: '迁出注销', type: 'line', smooth: true, data: [12, 15, 9, 11, 13, 10], lineStyle: { color: '#94a3b8', width: 3, type: 'dashed' }, symbol: 'circle', symbolSize: 6 },
      { name: '在档总数', type: 'line', smooth: true, data: [1180, 1203, 1249, 1279, 1314, 1356], lineStyle: { color: '#22d3ee', width: 4 }, symbol: 'none' },
    ],
  }), [])

  const devicePieOption = useMemo(() => ({
    tooltip: { trigger: 'item' },
    legend: { bottom: 0, textStyle: { color: '#64748b' } },
    series: [{
      type: 'pie',
      radius: ['45%', '72%'],
      label: { color: '#475569' },
      emphasis: { label: { fontSize: 16 } },
      data: [
        { value: 593, name: '已关联', itemStyle: { color: '#22d3ee' } },
        { value: 49, name: '未关联', itemStyle: { color: '#f59e0b' } },
      ],
    }],
  }), [])

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div className="text-2xl font-semibold text-slate-900">报表统计</div>
        <div className="mt-2 text-sm text-slate-500">全局数据看板（仅管理员可见）</div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map(s => (
          <div key={s.label} className={`rounded-2xl border bg-gradient-to-br ${s.color} px-5 py-4 shadow-sm`}>
            <div className="text-xs font-medium opacity-70">{s.label}</div>
            <div className="mt-2 text-3xl font-bold">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <PanelCard title="重点人群变化趋势" subtitle="按类别逐月统计，后端返回 domain 对象 → 前端渲染 ECharts">
          <EChart option={populationTrendOption} height={320} />
        </PanelCard>
        <PanelCard title="老人档案变化趋势" subtitle="新增建档 / 迁出注销 / 在档总数 逐月变化">
          <EChart option={elderlyTrendOption} height={320} />
        </PanelCard>
      </div>

      <PanelCard title="设备关联统计" subtitle="已关联设备 vs 未关联设备占比">
        <EChart option={devicePieOption} height={320} />
      </PanelCard>
    </div>
  )
}
