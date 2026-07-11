import type { ColumnsType } from 'antd/es/table'
import { StatusTag } from '../components/common'
import { accountRows, deviceRows, elderlyRows, populationRows, reportRows, warningRows } from '../mock-data'

export type WorkspaceConfig = {
  title: string
  subtitle: string
  heroStats: Array<{ label: string; value: string; hint: string }>
  columns: ColumnsType<Record<string, unknown>>
  dataSource: Record<string, unknown>[]
  focusTitle: string
  focusItems: Array<{ label: string; value: string }>
  progress: Array<{ label: string; value: number }>
}

export const workspaceConfigs: Record<string, WorkspaceConfig> = {
  '/elderly-profiles': {
    title: '老人档案',
    subtitle: '围绕 ElderlyProfile 的信息列表、状态管理与关联业务视图。',
    heroStats: [
      { label: '在档人数', value: '1,280', hint: '本月新增 42 人' },
      { label: '高风险标签', value: '238', hint: '慢病 / 跌倒 / 失智' },
      { label: '待更新档案', value: '16', hint: '超过 30 天未维护' },
      { label: '关联设备率', value: '91%', hint: '设备 / 档案已绑定' },
    ],
    columns: [
      { title: '姓名', dataIndex: 'name' },
      { title: '性别', dataIndex: 'gender' },
      { title: '年龄', dataIndex: 'age' },
      { title: '护理级别', dataIndex: 'careLevel' },
      { title: '机构', dataIndex: 'institutionId' },
      { title: '状态', dataIndex: 'status', render: (value: string) => <StatusTag value={value} /> },
      { title: '更新时间', dataIndex: 'updatedAt' },
    ],
    dataSource: elderlyRows as unknown as Record<string, unknown>[],
    focusTitle: '档案联动',
    focusItems: [
      { label: '关联预警', value: '今日新增 12 条' },
      { label: '关联报告', value: '待复核 3 份' },
      { label: '重点人群', value: 'A 级 21 人' },
    ],
    progress: [{ label: '建档完整度', value: 94 }, { label: '标签覆盖率', value: 88 }, { label: '关联设备率', value: 91 }],
  },
  '/health-warnings': {
    title: '健康预警',
    subtitle: '围绕 HealthWarning 的分级、处置、转派与闭环状态。',
    heroStats: [
      { label: '今日预警', value: '31', hint: '设备异常占 71%' },
      { label: '高风险', value: '12', hint: '需优先处置' },
      { label: '处理中', value: '8', hint: '已分派到医生' },
      { label: '闭环率', value: '92%', hint: '较上周 +3.1%' },
    ],
    columns: [
      { title: '预警类型', dataIndex: 'warningType' },
      { title: '老人', dataIndex: 'elderlyName' },
      { title: '级别', dataIndex: 'severity', render: (value: string) => <StatusTag value={value} /> },
      { title: '来源', dataIndex: 'source' },
      { title: '状态', dataIndex: 'status', render: (value: string) => <StatusTag value={value} /> },
      { title: '发生时间', dataIndex: 'occurredAt' },
      { title: '负责人', dataIndex: 'owner' },
    ],
    dataSource: warningRows as unknown as Record<string, unknown>[],
    focusTitle: '处置面板',
    focusItems: [
      { label: '30 分钟内未响应', value: '2 条' },
      { label: '待转派', value: '1 条' },
      { label: '值班医生', value: '李医生 / 陈医生' },
    ],
    progress: [{ label: '高风险响应及时率', value: 90 }, { label: '闭环率', value: 92 }, { label: '转派成功率', value: 96 }],
  },
  '/assessment-reports': {
    title: '评估报告',
    subtitle: '报告列表、详情摘要、生成建议与导出位。',
    heroStats: [
      { label: '今日新增报告', value: '12', hint: '健康 / 康复 / 睡眠' },
      { label: '待复核', value: '3', hint: '医生待确认' },
      { label: '平均分', value: '81', hint: '较上周 +2' },
      { label: '导出次数', value: '28', hint: '本周累计' },
    ],
    columns: [
      { title: '报告类型', dataIndex: 'reportType' },
      { title: '老人', dataIndex: 'elderlyName' },
      { title: '分数', dataIndex: 'score' },
      { title: '等级', dataIndex: 'grade' },
      { title: '评估人', dataIndex: 'assessor' },
      { title: '评估时间', dataIndex: 'assessedAt' },
    ],
    dataSource: reportRows as unknown as Record<string, unknown>[],
    focusTitle: '报告摘要',
    focusItems: [
      { label: '高风险项', value: '血压偏高 / 睡眠不足' },
      { label: '建议动作', value: '复测、康复训练、随访' },
      { label: '本周报告覆盖', value: '84%' },
    ],
    progress: [{ label: '报告完成率', value: 84 }, { label: '复核完成率', value: 77 }, { label: '导出就绪度', value: 95 }],
  },
  '/key-populations': {
    title: '重点人群',
    subtitle: '高风险老人分层、负责人和随访周期视图。',
    heroStats: [
      { label: '总人数', value: '86', hint: 'A 级 21 人' },
      { label: '待随访', value: '14', hint: '48 小时内' },
      { label: '超周期', value: '6', hint: '需补齐执行' },
      { label: '负责人覆盖', value: '100%', hint: '全部已指派' },
    ],
    columns: [
      { title: '类别', dataIndex: 'category' },
      { title: '老人', dataIndex: 'elderlyName' },
      { title: '等级', dataIndex: 'level' },
      { title: '负责人', dataIndex: 'ownerDoctor' },
      { title: '周期', dataIndex: 'cycle' },
      { title: '状态', dataIndex: 'status', render: (value: string) => <StatusTag value={value} /> },
    ],
    dataSource: populationRows as unknown as Record<string, unknown>[],
    focusTitle: '分层治理',
    focusItems: [
      { label: '慢病高风险', value: '39 人' },
      { label: '跌倒风险', value: '18 人' },
      { label: '认知关注', value: '11 人' },
    ],
    progress: [{ label: '随访达成率', value: 87 }, { label: '负责医生覆盖', value: 100 }, { label: '周期达标率', value: 82 }],
  },
  '/report-statistics': {
    title: '报表统计',
    subtitle: '面向管理层的总览、趋势与分布型页面骨架。',
    heroStats: [
      { label: '统计总览', value: '6 组', hint: '趋势 / 分布 / 导出' },
      { label: '本周报表', value: '28', hint: '已生成' },
      { label: '导出任务', value: '9', hint: '等待下载' },
      { label: '共享看板', value: '4', hint: '机构级视图' },
    ],
    columns: [
      { title: '维度', dataIndex: 'category' },
      { title: '说明', dataIndex: 'elderlyName' },
      { title: '级别', dataIndex: 'level' },
      { title: '负责人', dataIndex: 'ownerDoctor' },
      { title: '状态', dataIndex: 'status', render: (value: string) => <StatusTag value={value} /> },
    ],
    dataSource: populationRows as unknown as Record<string, unknown>[],
    focusTitle: '输出形式',
    focusItems: [
      { label: '趋势图', value: '老人规模 / 预警波动 / 在线率' },
      { label: '分布图', value: '区域 / 机构 / 风险等级' },
      { label: '导出位', value: 'PDF / Excel 占位已预留' },
    ],
    progress: [{ label: '图表完成度', value: 78 }, { label: '导出位预留', value: 96 }, { label: '指标一致性', value: 89 }],
  },
  '/devices': {
    title: '设备管理',
    subtitle: '按 Device 结构展示绑定关系、在线状态与上报情况。',
    heroStats: [
      { label: '设备总数', value: '642', hint: '活跃绑定 593 台' },
      { label: '在线设备', value: '93%', hint: '今日峰值 95%' },
      { label: '离线待排查', value: '12', hint: '超过 6 小时' },
      { label: '待绑定', value: '49', hint: '新入库设备' },
    ],
    columns: [
      { title: '设备名称', dataIndex: 'deviceName' },
      { title: '设备类型', dataIndex: 'deviceType' },
      { title: 'SN', dataIndex: 'deviceSn' },
      { title: '绑定状态', dataIndex: 'bindingStatus', render: (value: string) => <StatusTag value={value} /> },
      { title: '在线状态', dataIndex: 'onlineStatus', render: (value: string) => <StatusTag value={value} /> },
      { title: '关联老人', dataIndex: 'elderlyName' },
      { title: '最近上报', dataIndex: 'lastReportAt' },
    ],
    dataSource: deviceRows as unknown as Record<string, unknown>[],
    focusTitle: '设备巡检',
    focusItems: [
      { label: '网关异常', value: '1 处' },
      { label: '离线设备', value: '2 台重点跟进' },
      { label: '固件待升级', value: '17 台' },
    ],
    progress: [{ label: '绑定完成率', value: 92 }, { label: '在线率', value: 93 }, { label: '上报完整率', value: 89 }],
  },
  '/elderly-accounts': {
    title: '老人账户管理',
    subtitle: '老人端登录账号创建、启停与密码重置位。',
    heroStats: [
      { label: '账户总数', value: '418', hint: '本月新增 32' },
      { label: '已启用', value: '392', hint: '正常使用中' },
      { label: '待激活', value: '14', hint: '未首次登录' },
      { label: '重置密码', value: '9', hint: '本周处理' },
    ],
    columns: [
      { title: '用户名', dataIndex: 'username' },
      { title: '姓名', dataIndex: 'realName' },
      { title: '角色', dataIndex: 'roleCode' },
      { title: '手机号', dataIndex: 'mobile' },
      { title: '状态', dataIndex: 'status', render: (value: string) => <StatusTag value={value} /> },
      { title: '最近登录', dataIndex: 'lastLoginAt' },
    ],
    dataSource: accountRows as unknown as Record<string, unknown>[],
    focusTitle: '账户运维',
    focusItems: [
      { label: '启停记录', value: '本周 18 次操作' },
      { label: '异常登录', value: '0 次' },
      { label: '密码重置', value: '9 条申请' },
    ],
    progress: [{ label: '激活率', value: 94 }, { label: '可用率', value: 97 }, { label: '资料补齐率', value: 82 }],
  },
  '/doctor-accounts': {
    title: '医生账户管理',
    subtitle: '医生账号、角色、机构和状态管理视图。',
    heroStats: [
      { label: '医生账号', value: '96', hint: '覆盖 11 个机构' },
      { label: '已启用', value: '91', hint: '活跃值班中' },
      { label: '待审核', value: '3', hint: '新申请账号' },
      { label: '角色变更', value: '7', hint: '本周已处理' },
    ],
    columns: [
      { title: '用户名', dataIndex: 'username' },
      { title: '姓名', dataIndex: 'realName' },
      { title: '角色', dataIndex: 'roleCode' },
      { title: '手机号', dataIndex: 'mobile' },
      { title: '状态', dataIndex: 'status', render: (value: string) => <StatusTag value={value} /> },
      { title: '最近登录', dataIndex: 'lastLoginAt' },
    ],
    dataSource: accountRows as unknown as Record<string, unknown>[],
    focusTitle: '医生排班联动',
    focusItems: [
      { label: '值班医生', value: '李医生 / 陈医生 / 周医生' },
      { label: '机构归属', value: '已绑定 11 个机构' },
      { label: '待重置密码', value: '2 条' },
    ],
    progress: [{ label: '排班覆盖', value: 95 }, { label: '机构归属完整度', value: 98 }, { label: '账号可用率', value: 96 }],
  },
  '/users': {
    title: '用户账号管理',
    subtitle: '系统账号、角色、权限与审计入口。',
    heroStats: [
      { label: '系统账号', value: '134', hint: '管理员 / 运营 / 只读' },
      { label: '启用中', value: '122', hint: '运行稳定' },
      { label: '待分配角色', value: '5', hint: '新建后未完成配置' },
      { label: '审计事件', value: '241', hint: '近 7 天记录' },
    ],
    columns: [
      { title: '用户名', dataIndex: 'username' },
      { title: '姓名', dataIndex: 'realName' },
      { title: '角色', dataIndex: 'roleCode' },
      { title: '手机号', dataIndex: 'mobile' },
      { title: '状态', dataIndex: 'status', render: (value: string) => <StatusTag value={value} /> },
      { title: '最近登录', dataIndex: 'lastLoginAt' },
    ],
    dataSource: accountRows as unknown as Record<string, unknown>[],
    focusTitle: '权限治理',
    focusItems: [
      { label: '高权限账号', value: '12 个' },
      { label: '待角色分配', value: '5 个' },
      { label: '最近审计', value: '07-11 09:18 更新' },
    ],
    progress: [{ label: '角色配置完整度', value: 93 }, { label: '审计覆盖率', value: 98 }, { label: '账号启用率', value: 91 }],
  },
}
