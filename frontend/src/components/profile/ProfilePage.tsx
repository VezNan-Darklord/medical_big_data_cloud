import { CheckCircleOutlined, FireOutlined, LoginOutlined, MessageOutlined, SettingOutlined } from '@ant-design/icons'
import { Avatar, Button } from 'antd'
import { PanelCard } from '../common'
import { todoItems } from '../../mock-data'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_1fr]">
        <PanelCard title="个人资料" subtitle="Profile / auth/me 的前端占位版本">
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex flex-col items-center rounded-[28px] bg-slate-50 px-8 py-8">
              <Avatar size={104} className="bg-cyan-600 text-3xl">管</Avatar>
              <div className="mt-4 text-xl font-semibold text-slate-900">系统管理员</div>
              <div className="mt-1 text-sm text-slate-500">admin · 分析师</div>
              <Button className="mt-5 rounded-xl" type="primary">编辑资料</Button>
            </div>
            <div className="grid flex-1 gap-4 md:grid-cols-2">
              {[
                ['手机号', '186****3352'],
                ['所属机构', '南山区智慧医养中心'],
                ['最近登录', '2026-07-11 09:30'],
                ['角色权限', '系统管理员 / 分析师'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 p-4">
                  <div className="text-xs text-slate-500">{label}</div>
                  <div className="mt-2 font-medium text-slate-900">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </PanelCard>
        <PanelCard title="安全与偏好" subtitle="账户安全、通知和主题设置">
          <div className="space-y-4">
            {[
              [<LoginOutlined key="1" />, '登录安全', '双 token 校验已启用'],
              [<SettingOutlined key="2" />, '通知偏好', '预警、报告、设备异常全部开启'],
              [<MessageOutlined key="3" />, '消息中心', '今日未读 6 条'],
              [<CheckCircleOutlined key="4" />, '审计留痕', '最近一次资料更新 2026-07-10'],
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
      <PanelCard title="我的待办与消息" subtitle="后续可接 profile/todos 和消息中心接口">
        <div className="grid gap-4 lg:grid-cols-3">
          {todoItems.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="font-medium text-slate-900">{item.title}</div>
                <FireOutlined className="text-amber-500" />
              </div>
              <div className="mt-3 text-sm text-slate-500">{item.meta}</div>
              <Button type="link" className="mt-3 px-0">进入处理</Button>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  )
}
