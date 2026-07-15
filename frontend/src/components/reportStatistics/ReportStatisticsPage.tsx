import { Button, Empty, Skeleton, message } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import type { EChartsCoreOption } from 'echarts'
import {
  useExportStatisticsMutation,
  useStatisticsOverviewQuery,
  useStatisticsTrendsQuery,
} from '../../../api/hooks/reportStatisticsHooks'
import type { DashboardChart } from '../../../api/models/DashboardChart'
import EChart from '../charts/ECharts'
import { PanelCard } from '../common'

function chartOption(chart: DashboardChart): EChartsCoreOption {
  if (chart.chartType === 'pie') {
    const values = chart.series[0]?.data ?? []
    return {
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [{
        name: chart.series[0]?.name,
        type: 'pie',
        radius: ['45%', '72%'],
        data: chart.xAxis.map((name, index) => ({ name, value: values[index] ?? 0 })),
      }],
    }
  }

  return {
    tooltip: { trigger: 'axis' },
    legend: { bottom: 0 },
    grid: { left: 24, right: 16, top: 24, bottom: 44, containLabel: true },
    xAxis: { type: 'category', data: chart.xAxis },
    yAxis: { type: 'value' },
    series: chart.series.map(item => ({
      name: item.name,
      type: chart.chartType,
      data: item.data ?? [],
      smooth: chart.chartType === 'line',
    })),
  }
}

export default function ReportStatisticsPage() {
  const overviewQuery = useStatisticsOverviewQuery()
  const trendsQuery = useStatisticsTrendsQuery()
  const exportMutation = useExportStatisticsMutation()
  const overview = overviewQuery.data?.data
  const charts = trendsQuery.data?.data ?? []

  const statCards = overview ? [
    { label: '在档老人', value: overview.totalElderlyCount.toLocaleString() },
    { label: '医生总数', value: overview.totalDoctorCount.toLocaleString() },
    { label: '设备总数', value: overview.totalDeviceCount.toLocaleString() },
    { label: '未关联设备', value: overview.unboundDeviceCount.toLocaleString() },
    { label: '设备在线率', value: `${(overview.deviceOnlineRate * 100).toFixed(1)}%` },
    { label: '未处理预警', value: overview.unhandledWarningCount.toLocaleString() },
  ] : []

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div>
          <div className="text-2xl font-semibold text-slate-900">报表统计</div>
          <div className="mt-2 text-sm text-slate-500">全局业务数据</div>
        </div>
        <Button
          icon={<DownloadOutlined />}
          loading={exportMutation.isPending}
          onClick={() => exportMutation.mutate(undefined, {
            onError: (error: Error) => message.error(error.message || '导出失败'),
          })}
        >
          导出 CSV
        </Button>
      </div>

      {overviewQuery.isLoading ? <Skeleton active paragraph={{ rows: 2 }} /> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {statCards.map(item => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
              <div className="text-xs font-medium text-slate-500">{item.label}</div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{item.value}</div>
            </div>
          ))}
        </div>
      )}

      {trendsQuery.isLoading ? <Skeleton active paragraph={{ rows: 10 }} /> : charts.length === 0 ? (
        <Empty description="暂无趋势数据" />
      ) : (
        <div className="grid gap-6 xl:grid-cols-2">
          {charts.map((chart, index) => (
            <PanelCard key={`${chart.title}-${index}`} title={chart.title}>
              <EChart option={chartOption(chart)} height={320} />
            </PanelCard>
          ))}
        </div>
      )}
    </div>
  )
}
