import { Link, useLocation } from 'react-router-dom'
import { Menu } from 'antd'
import { type NavItem } from '../mock-data'
import { TeamOutlined, AlertOutlined, MedicineBoxOutlined, SafetyCertificateOutlined, RadarChartOutlined, CloudServerOutlined, UserOutlined, HeartOutlined } from '@ant-design/icons'
import { canAccessPath } from '../routes/const'
import { useCurrentRoleCode } from '../store/useCurrentRoleCode'

const allNavigationItems: NavItem[] = [
  { key: 'elderly', path: '/elderly-profiles', label: '老人档案', icon: <TeamOutlined />, description: '老人信息、标签、分组与关联业务视图。' },
  { key: 'warnings', path: '/health-warnings', label: '健康预警', icon: <AlertOutlined />, description: '设备异常、等级分层、转派与处置状态。' },
  { key: 'reports', path: '/assessment-reports', label: '评估报告', icon: <MedicineBoxOutlined />, description: '评估生成、复核记录与建议摘要。' },
  { key: 'populations', path: '/key-populations', label: '重点人群', icon: <SafetyCertificateOutlined />, description: '高风险老人分层与随访负责人。' },
  { key: 'statistics', path: '/report-statistics', label: '报表统计', icon: <RadarChartOutlined />, description: '趋势、分布与导出看板。' },
  { key: 'devices', path: '/devices', label: '设备管理', icon: <CloudServerOutlined />, description: '绑定关系、在线率与上报情况。' },
  { key: 'elderly-accounts', path: '/elderly-accounts', label: '老人账户管理', icon: <UserOutlined />, description: '老人端账户启停、重置密码与使用情况。' },
  { key: 'doctor-accounts', path: '/doctor-accounts', label: '医生账户管理', icon: <HeartOutlined />, description: '医生账号、角色、机构归属与状态。' },
  { key: 'analysis', path: '/decision-analysis', label: '大数据决策分析', icon: <RadarChartOutlined />, description: '多维分析、AI 结论与资源建议。' },
  { key: 'profile', path: '/profile', label: '个人中心', icon: <UserOutlined />, description: '个人资料、安全设置、待办与消息。' },
]

export default function AppSidebar() {
  const location = useLocation();

  const roleCode = useCurrentRoleCode();
  const visibleItems = roleCode
    ? allNavigationItems.filter(item => canAccessPath(roleCode, item.path))
    : []

  const currentNav = visibleItems.find((item) => location.pathname === item.path) ?? visibleItems[0]
  return (
    <aside className="row-span-2 flex h-full min-h-0 flex-col border-r border-slate-200/80 bg-white/95">
      <div className="border-b border-slate-200/70 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.6),rgba(37,99,235,0.9))] text-lg font-semibold text-white shadow-[0_12px_32px_rgba(37,99,235,0.28)]">医</div>
          <div>
            <div className="text-sm font-semibold text-slate-900">医养结合云端</div>
            <div className="text-xs text-slate-500">Smart Care Command</div>
          </div>
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="mt-2 text-2xl font-semibold text-slate-900">欢迎使用</div>
          <div className="mt-1 text-xs text-slate-500">请选择左侧菜单进行操作</div>
        </div>
      </div>
      <div className="min-h-0 flex-1 px-3 pb-4">
        <Menu
          mode="inline"
          selectedKeys={[currentNav?.key ?? '']}
          items={visibleItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <Link to={item.path}>{item.label}</Link>,
          }))}
          className="border-none bg-transparent"
        />
      </div>
    </aside>
  )
}
