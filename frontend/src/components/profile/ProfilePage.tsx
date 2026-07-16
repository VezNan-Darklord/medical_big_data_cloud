import { CheckCircleOutlined, LoginOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Skeleton, Tag } from 'antd'
import { useGetCurrentUserQuery } from '../../../api/hooks/authHooks'
import { useGetTodosQuery } from '../../../api/hooks/profileHooks'
import { PanelCard } from '../common'
import type { User } from '../../../api/models/User'

const roleNames: Record<string, string> = {
  admin: '系统管理员',
  doctor: '医生',
  elderly: '老人',
}

export default function ProfilePage() {
  const { data, isLoading } = useGetCurrentUserQuery()
  const user = data?.data as User | undefined;
  const { data: todosData } = useGetTodosQuery()
  const todos = todosData?.data;

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 8 }} className="rounded-[28px] bg-white p-8" />
  }

  const displayName = user?.realName ?? user?.username ?? '未登录'
  const initial = displayName.slice(0, 1)
  const roleName = roleNames[user?.roleCode ?? ''] ?? user?.roleCode ?? '-'
  const statusColor = user?.status === 'enabled' ? 'green' : user?.status === 'disabled' ? 'red' : 'default'

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <PanelCard title="个人资料" subtitle={user?.username ?? ''}>
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex flex-col items-center rounded-[28px] bg-slate-50 px-8 py-8">
              <Avatar size={104} className="bg-cyan-600 text-3xl">{initial}</Avatar>
              <div className="mt-4 text-xl font-semibold text-slate-900">{displayName}</div>
              <div className="mt-1 text-sm text-slate-500">{roleName}</div>
              <Tag color={statusColor} className="mt-3">
                {user?.status === 'enabled' ? '已启用' : user?.status === 'disabled' ? '已禁用' : user?.status ?? '-'}
              </Tag>
            </div>
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              {[
                ['手机号', user?.mobile ?? '-'],
                ['用户名', user?.username ?? '-'],
                ['最近登录', user?.lastLoginAt ?? '-'],
                ['创建时间', user?.createdAt ?? '-'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="mt-2 font-medium text-slate-900">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </PanelCard>
        <PanelCard title="安全与状态" subtitle="账户安全与系统信息">
          <div className="space-y-4">
            {[
              [<LoginOutlined key="1" />, '登录安全', '双 token 校验已启用'],
              [<SettingOutlined key="2" />, '角色权限', roleName],
              [<MessageOutlined key="3" />, '账户状态', user?.status === 'enabled' ? '正常' : '受限'],
              [<CheckCircleOutlined key="4" />, '账号 ID', user?.id ? user.id.slice(0, 8) + '...' : '-'],
            ].map(([icon, title, desc]) => (
              <div key={String(title)} className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-600 shadow-sm">{icon}</div>
                <div>
                  <div className="font-medium text-slate-900">{title}</div>
                  <div className="mt-1 text-sm text-slate-500">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </PanelCard>
      </div>
      <PanelCard title="我的待办" subtitle={Object.entries(todos || {}).length > 0 ? `${Object.entries(todos || {}).length} 条待处理` : '暂无待办'}>
        <div className="grid gap-4 lg:grid-cols-3">
          {Object.entries(todos || {}).length > 0 ? Object.entries(todos || {}).map(([key, item]: [string, { title?: string; description?: string; meta?: string }]) => (
            <div key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="font-medium text-slate-900">{item.title ?? `待办 ${Object.keys(todos || {}).indexOf(key) + 1}`}</div>
              <div className="mt-2 text-sm text-slate-500">{item.description ?? item.meta ?? ''}</div>
            </div>
          )) : (
            <div className="col-span-full text-center text-sm text-slate-400 py-10">暂无待办事项</div>
          )}
        </div>
      </PanelCard>
    </div>
  )
}
