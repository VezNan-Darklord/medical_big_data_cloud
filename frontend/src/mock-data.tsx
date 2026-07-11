import type { ReactNode } from 'react'

export type NavItem = {
  key: string
  path: string
  label: string
  icon: ReactNode
  description: string
}


export const dashboardMetrics = [
  { label: '在档老人', value: '1,280', delta: '+12.4%', tone: 'cyan' },
  { label: '未处理预警', value: '04', delta: '-18.0%', tone: 'red' },
  { label: '重点人群', value: '86', delta: '+6.8%', tone: 'violet' },
  { label: '设备在线率', value: '93%', delta: '+1.2%', tone: 'emerald' },
] as const

export const elderlyRows = [
  { key: '1', name: '张三', gender: '男', age: 78, careLevel: 'C2', tags: ['慢病', '高风险'], status: 'active', institutionId: 'inst-001', updatedAt: '2026-07-11 10:20' },
  { key: '2', name: '李秀芳', gender: '女', age: 83, careLevel: 'B1', tags: ['失眠'], status: 'active', institutionId: 'inst-014', updatedAt: '2026-07-11 09:05' },
  { key: '3', name: '王建国', gender: '男', age: 76, careLevel: 'C1', tags: ['复诊中'], status: 'paused', institutionId: 'inst-009', updatedAt: '2026-07-10 17:48' },
  { key: '4', name: '何桂兰', gender: '女', age: 81, careLevel: 'A3', tags: ['高血压', '随访'], status: 'active', institutionId: 'inst-006', updatedAt: '2026-07-10 16:31' },
]

export const warningRows = [
  { key: '1', warningType: '异常心率', elderlyName: '张三', severity: 'high', source: 'device', status: 'unprocessed', occurredAt: '2026-07-11 09:40', owner: '李医生' },
  { key: '2', warningType: '血压波动', elderlyName: '何桂兰', severity: 'medium', source: 'manual', status: 'processing', occurredAt: '2026-07-11 08:15', owner: '陈医生' },
  { key: '3', warningType: '夜间离床', elderlyName: '李秀芳', severity: 'low', source: 'device', status: 'processed', occurredAt: '2026-07-10 22:40', owner: '值班组' },
]

export const reportRows = [
  { key: '1', reportType: '健康评估', elderlyName: '张三', score: 82, grade: 'B', assessor: '李医生', assessedAt: '2026-07-11 11:00', summary: '整体稳定，需关注血压控制' },
  { key: '2', reportType: '康复评估', elderlyName: '王建国', score: 74, grade: 'C+', assessor: '周医生', assessedAt: '2026-07-10 15:30', summary: '建议增加步态训练' },
  { key: '3', reportType: '睡眠评估', elderlyName: '李秀芳', score: 88, grade: 'A-', assessor: '吴医生', assessedAt: '2026-07-09 20:20', summary: '睡眠结构改善明显' },
]

export const populationRows = [
  { key: '1', category: '慢病高风险', elderlyName: '张三', level: 'A', ownerDoctor: '李医生', cycle: '7 天', status: 'active' },
  { key: '2', category: '跌倒高风险', elderlyName: '何桂兰', level: 'A', ownerDoctor: '陈医生', cycle: '3 天', status: 'active' },
  { key: '3', category: '认知关注', elderlyName: '王建国', level: 'B', ownerDoctor: '周医生', cycle: '14 天', status: 'watching' },
]

export const deviceRows = [
  { key: '1', deviceName: '血压计 A100', deviceType: '血压监测', deviceSn: 'SN20260706001', bindingStatus: 'bound', onlineStatus: 'online', elderlyName: '张三', lastReportAt: '09:40' },
  { key: '2', deviceName: '腕带 B220', deviceType: '生命体征', deviceSn: 'SN20260706029', bindingStatus: 'bound', onlineStatus: 'offline', elderlyName: '何桂兰', lastReportAt: '07:14' },
  { key: '3', deviceName: '睡眠带 C80', deviceType: '睡眠监测', deviceSn: 'SN20260706112', bindingStatus: 'unbound', onlineStatus: 'online', elderlyName: '-', lastReportAt: '11:08' },
]

export const accountRows = [
  { key: '1', username: 'doctor01', realName: '李医生', roleCode: 'doctor', mobile: '13900000000', status: 'enabled', lastLoginAt: '2026-07-11 09:30' },
  { key: '2', username: 'nurse08', realName: '陈护士', roleCode: 'operator', mobile: '13800000001', status: 'enabled', lastLoginAt: '2026-07-11 08:50' },
  { key: '3', username: 'viewer02', realName: '数据分析员', roleCode: 'viewer', mobile: '13700000002', status: 'disabled', lastLoginAt: '2026-07-09 19:12' },
]

export const todoItems = [
  { title: '处理高风险预警 4 条', meta: '健康预警 · 需 30 分钟内闭环', status: '紧急' },
  { title: '复核评估报告 3 份', meta: '评估报告 · 待医生确认建议', status: '处理中' },
  { title: '设备离线排查 2 台', meta: '设备管理 · 超过 6 小时未上报', status: '待跟进' },
]

export const insightItems = [
  { title: '高风险预警集中在慢病老人', description: '近 7 天高血压与心率异常预警占比 61%，主要分布在南山区两个站点。', confidence: '91%', priority: '高优先级' },
  { title: '设备离线影响夜间预警完整性', description: '23:00 - 05:00 时段存在数据断档，建议先巡检腕带与网关供电。', confidence: '86%', priority: '中优先级' },
  { title: '重点人群随访节奏偏慢', description: 'A 级重点人群本周平均随访周期 8.2 天，高于目标值 7 天。', confidence: '84%', priority: '中优先级' },
]

export const actionItems = [
  { title: '提高慢病老人复测频次', owner: '慢病管理组', impact: '预计减少 18% 未处理预警' },
  { title: '为离线设备建立 2 小时巡检机制', owner: '运维值班组', impact: '预计提升 3.5% 在线率' },
  { title: '针对 A 级重点人群补齐本周随访', owner: '签约医生组', impact: '预计提升闭环率 12%' },
]

export const trendDates = ['07-05', '07-06', '07-07', '07-08', '07-09', '07-10', '07-11']
