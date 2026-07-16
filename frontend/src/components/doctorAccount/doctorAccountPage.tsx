import { useState, useMemo } from 'react'
import { Button, Card, Form, Input, Select, message, Spin } from 'antd'
import { PlusOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons'
import {
  useListDoctorAccountsQuery,
  useCreateDoctorAccountMutation,
  useUpdateDoctorAccountMutation,
  useResetDoctorPasswordMutation,
} from '../../../api/hooks/doctorAccountHooks'
import { StatusTag, PopWindow } from '../common'
import { useIntersectionObserver } from '../common/useIntersectionObserver'
import type { SpecializedUserCreateRequest } from '../../../api/models/SpecializedUserCreateRequest'
import type { UserUpdateRequest } from '../../../api/models/UserUpdateRequest'
import type { PasswordRequest } from '../../../api/models/PasswordRequest'
import type { User } from '../../../api/models/User'

interface AccountCardProps {
  account: User
  onResetPassword: (id: string, name: string) => void
  onEdit: (account: User) => void
}

function AccountCard({ account, onResetPassword, onEdit }: AccountCardProps) {
  const isEnabled = account.status === 'enabled'

  return (
    <Card className="overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm transition hover:shadow-md" styles={{ body: { padding: 20 } }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-lg font-semibold ${isEnabled ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-400'}`}>
            {(account.realName ?? account.username ?? '?')[0]}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-slate-900">{account.realName ?? account.username}</div>
            <div className="mt-0.5 text-sm text-slate-500">@{account.username}</div>
          </div>
        </div>
        <StatusTag value={account.status ?? 'disabled'} />
      </div>

      <div className="mt-4 space-y-1.5 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">手机号</span>
          <span>{account.mobile || '-'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">最后登录</span>
          <span className="text-xs">{account.lastLoginAt?.slice(0, 10) || '-'}</span>
        </div>
      </div>

      <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
        <Button size="small" icon={<ReloadOutlined />} className="flex-1" onClick={() => onResetPassword(account.id!, account.realName ?? account.username!)}>重置密码</Button>
        <Button size="small" icon={<EditOutlined />} className="flex-1" onClick={() => onEdit(account)}>编辑</Button>
      </div>
    </Card>
  )
}

function CreateAccountModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  const createMutation = useCreateDoctorAccountMutation()

  return (
    <PopWindow open={open} onClose={onClose} title="创建医生账号" width={520}>
      <Form form={form} layout="vertical" onFinish={(v: SpecializedUserCreateRequest) => {
        createMutation.mutate(v, {
          onSuccess: () => { message.success('账号创建成功'); form.resetFields(); onClose() },
          onError: (err: Error) => message.error(err?.message ?? '创建失败'),
        })
      }}>
        <div className="grid gap-0 md:grid-cols-2 md:gap-x-4">
          <Form.Item name="username" label="用户名" rules={[{ required: true, min: 3, max: 50 }]}><Input /></Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, min: 6, max: 20 }]}><Input.Password /></Form.Item>
          <Form.Item name="realName" label="真实姓名" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="mobile" label="手机号"><Input /></Form.Item>
          <Form.Item name="institutionId" label="所属机构"><Input /></Form.Item>
          <Form.Item name="regionCode" label="所属区域"><Input /></Form.Item>
          <Form.Item name="status" label="状态">
            <Select options={[{ value: 'enabled', label: '启用' }, { value: 'disabled', label: '禁用' }]} />
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" loading={createMutation.isPending} block size="large">创建账号</Button>
      </Form>
    </PopWindow>
  )
}

function EditAccountModal({ open, account, onClose }: { open: boolean; account: User | null; onClose: () => void }) {
  const [form] = Form.useForm()
  const updateMutation = useUpdateDoctorAccountMutation()

  if (!account) return null

  return (
    <PopWindow open={open} onClose={onClose} title={`编辑 - ${account.realName ?? account.username}`} width={440}>
      <Form form={form} layout="vertical" initialValues={{ realName: account.realName, mobile: account.mobile, institutionId: account.institutionId, regionCode: account.regionCode, status: account.status }} onFinish={(v: UserUpdateRequest) => {
        updateMutation.mutate({ id: account.id!, ...v }, {
          onSuccess: () => { message.success('更新成功'); form.resetFields(); onClose() },
          onError: (err: Error) => message.error(err?.message ?? '更新失败'),
        })
      }}>
        <div className="grid gap-0 md:grid-cols-2 md:gap-x-4">
          <Form.Item name="realName" label="真实姓名"><Input /></Form.Item>
          <Form.Item name="mobile" label="手机号"><Input /></Form.Item>
          <Form.Item name="institutionId" label="所属机构"><Input /></Form.Item>
          <Form.Item name="regionCode" label="所属区域"><Input /></Form.Item>
          <Form.Item name="status" label="状态">
            <Select options={[{ value: 'enabled', label: '启用' }, { value: 'disabled', label: '禁用' }]} />
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" loading={updateMutation.isPending} block size="large">保存修改</Button>
      </Form>
    </PopWindow>
  )
}

function ResetPasswordModal({ open, accountId, accountName, onClose }: { open: boolean; accountId: string; accountName: string; onClose: () => void }) {
  const [form] = Form.useForm()
  const resetMutation = useResetDoctorPasswordMutation()

  return (
    <PopWindow open={open} onClose={onClose} title={`重置密码 - ${accountName}`} width={400}>
      <Form form={form} layout="vertical" onFinish={(v: PasswordRequest) => {
        resetMutation.mutate({ id: accountId, ...v }, {
          onSuccess: () => { message.success('密码已重置'); form.resetFields(); onClose() },
          onError: (err: Error) => message.error(err?.message ?? '重置失败'),
        })
      }}>
        <Form.Item name="newPassword" label="新密码" rules={[{ required: true, min: 6, max: 20 }]}><Input.Password placeholder="至少 6 位" /></Form.Item>
        <Button type="primary" htmlType="submit" loading={resetMutation.isPending} block>确认重置</Button>
      </Form>
    </PopWindow>
  )
}

export default function DoctorAccountPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<User | null>(null)
  const [resetPwdTarget, setResetPwdTarget] = useState<{ id: string; name: string } | null>(null)
  const [statusFilter, setStatusFilter] = useState<'enabled' | 'disabled' | undefined>(undefined)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListDoctorAccountsQuery({
    status: statusFilter as 'enabled' | 'disabled' | undefined,
    pageSize: 20,
  })

  const allAccounts: User[] = useMemo(
    () => data?.pages.flatMap(p => p.data?.list ?? []) ?? [],
    [data],
  )

  const countEnabled = useMemo(() => allAccounts.filter(a => a.status === 'enabled').length, [allAccounts])
  const countDisabled = useMemo(() => allAccounts.filter(a => a.status === 'disabled').length, [allAccounts])

  const sentinelRef = useIntersectionObserver(
    () => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() },
    !isLoading,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div>
          <div className="text-2xl font-semibold text-slate-900">医生账户管理</div>
          <div className="mt-2 text-sm text-slate-500">共 {allAccounts.length} 个账户（启用 {countEnabled} · 禁用 {countDisabled}）</div>
        </div>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>创建账号</Button>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-slate-200/70 bg-slate-50 px-5 py-3">
        <span className="text-sm text-slate-500">筛选：</span>
        <Select
          allowClear
          placeholder="全部状态"
          style={{ width: 140 }}
          value={statusFilter}
          onChange={setStatusFilter}
          options={[{ value: 'enabled', label: '已启用' }, { value: 'disabled', label: '已禁用' }]}
        />
        <span className="text-xs text-slate-400">时间筛选由前端处理</span>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <Card key={i} loading className="rounded-2xl" />)}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allAccounts.map(a => (
              <AccountCard
                key={a.id}
                account={a}
                onResetPassword={(id, name) => setResetPwdTarget({ id, name })}
                onEdit={setEditTarget}
              />
            ))}
          </div>
          <div ref={sentinelRef} className="h-px" />
          {isFetchingNextPage && <div className="text-center"><Spin /></div>}
        </>
      )}

      <CreateAccountModal open={createOpen} onClose={() => setCreateOpen(false)} />
      <EditAccountModal open={!!editTarget} account={editTarget} onClose={() => setEditTarget(null)} />
      {resetPwdTarget && (
        <ResetPasswordModal
          open={!!resetPwdTarget}
          accountId={resetPwdTarget.id}
          accountName={resetPwdTarget.name}
          onClose={() => setResetPwdTarget(null)}
        />
      )}
    </div>
  )
}
