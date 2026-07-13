import { DashboardOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Button, DatePicker, Select, Space, Table } from 'antd'
import type { WorkspaceConfig } from '../../pages/workspace-config'
import { PanelCard } from './PanelCard'
import { MiniProgress } from './MiniProgress'

export default function WorkspacePage({ config }: { config: WorkspaceConfig }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-[28px] border border-slate-200/80 bg-white px-6 py-6 shadow-sm">
        <div>
          <div className="text-2xl font-semibold text-slate-900">{config.title}</div>
          <div className="mt-2 text-sm text-slate-500">{config.subtitle}</div>
        </div>
        <Space wrap>
          <Select defaultValue="近 7 天" options={[{ value: '近 7 天' }, { value: '近 30 天' }, { value: '本季度' }]} className="min-w-32" />
          <DatePicker.RangePicker />
          <Button icon={<MenuFoldOutlined />}>筛选</Button>
          <Button type="primary" icon={<DashboardOutlined />}>新建视图</Button>
        </Space>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {config.heroStats.map((item) => (
          <PanelCard key={item.label} title={item.label} subtitle={item.hint}>
            <div className="text-3xl font-semibold text-slate-900">{item.value}</div>
          </PanelCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <PanelCard title="业务列表" subtitle="按 OpenAPI 字段映射的静态展示">
          <Table pagination={{ pageSize: 5 }} rowKey="key" size="middle" dataSource={config.dataSource} columns={config.columns} />
        </PanelCard>
        <div className="space-y-6">
          <PanelCard title={config.focusTitle} subtitle="右侧聚合信息区">
            <div className="space-y-4">
              {config.focusItems.map((item) => (
                <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <div className="text-xs text-slate-500">{item.label}</div>
                  <div className="mt-1 text-lg font-medium text-slate-900">{item.value}</div>
                </div>
              ))}
            </div>
          </PanelCard>
          <PanelCard title="执行进度" subtitle="页面结构先按真实运营后台展开">
            <div className="space-y-4">
              {config.progress.map((item) => <MiniProgress key={item.label} {...item} />)}
            </div>
          </PanelCard>
        </div>
      </div>
    </div>
  )
}
