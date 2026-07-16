import { useState } from 'react'
import { Button, Card, Form, Input, InputNumber, Select, DatePicker, Tag, message, Skeleton, Drawer, Descriptions, Spin } from 'antd'
import { PlusOutlined, ReloadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useListElderlyProfilesQuery, useCreateElderlyProfileMutation, useGetElderlyProfileQuery, useDeleteElderlyProfileMutation, useUpdateElderlyProfileMutation } from '../../../api/hooks/elderlyProfileHooks'
import { useResetElderlyPasswordMutation } from '../../../api/hooks/elderlyAccountHooks'
import { PanelCard, PopWindow } from '../common'
import { ElderlyAccountSelect } from '../common/ElderlyAccountSelect'
import { useIntersectionObserver } from '../common/useIntersectionObserver'
import type { ElderlyProfileCreateRequest } from '../../../api/models/ElderlyProfileCreateRequest'
import type { ElderlyProfileUpdateRequest } from '../../../api/models/ElderlyProfileUpdateRequest'
import type { ElderlyProfile } from '../../../api/models/ElderlyProfile'
import { useCurrentRoleCode } from '../../store/useCurrentRoleCode'
import dayjs from 'dayjs'

function CreateProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [form] = Form.useForm()
  const createMutation = useCreateElderlyProfileMutation()

  return (
    <PopWindow open={open} onClose={onClose} title="新建老人档案" width={600}>
      <Form form={form} layout="vertical" onFinish={(values: ElderlyProfileCreateRequest) => {
        createMutation.mutate(values, {
          onSuccess: () => { message.success('档案创建成功'); form.resetFields(); onClose() },
          onError: (err: Error) => message.error(err?.message ?? '创建失败'),
        })
      }}>
        <div className="grid gap-0 md:grid-cols-2 md:gap-x-4">
          <Form.Item name="userId" label="关联老人账户" rules={[{ required: true }]}>
            <ElderlyAccountSelect setRealName={(name) => { form.setFieldsValue({ name }); }} setMobile={(phone) => { form.setFieldsValue({ phone }); }} />
          </Form.Item>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input disabled placeholder={'已关联账户'} />
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: true }]}>
            <Select options={[{ value: 'male', label: '男' }, { value: 'female', label: '女' }]} />
          </Form.Item>
          <Form.Item name="birthday" label="生日" getValueFromEvent={(d: dayjs.Dayjs | null) => d?.format('YYYY-MM-DD')}>
            <DatePicker className="w-full" onChange={(d) => form.setFieldsValue({ birthday: d })} />
          </Form.Item>
          <Form.Item name="age" label="年龄"><InputNumber className="w-full" min={0} max={150} /></Form.Item>
          <Form.Item name="phone" label="手机号"><Input disabled placeholder='已关联账户' /></Form.Item>
          <Form.Item name="address" label="地址"><Input /></Form.Item>
          <Form.Item name="careLevel" label="护理级别">
            <Select options={['A1','A2','A3','B1','B2','C1','C2'].map(v => ({ value: v, label: v }))} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select options={[{ value: 'active', label: '在档' }, { value: 'inactive', label: '停用' }]} />
          </Form.Item>
        </div>
        <Form.Item name="medicalHistory" label="既往病史"><Input.TextArea rows={3} /></Form.Item>
        <Button type="primary" htmlType="submit" loading={createMutation.isPending} block size="large">创建档案</Button>
      </Form>
    </PopWindow>
  )
}

function ProfileCard({
  profile,
  canDelete,
  canEdit,
  canResetPassword,
  onResetPassword,
  onViewDetail,
  onEdit,
}: {
  profile: ElderlyProfile
  canDelete: boolean
  canEdit: boolean
  canResetPassword: boolean
  onResetPassword: (id: string, name: string) => void
  onViewDetail: (id: string) => void
  onEdit: (profile: ElderlyProfile) => void
}) {
  const deleteMutation = useDeleteElderlyProfileMutation()
  const showActions = canEdit || canDelete || (canResetPassword && Boolean(profile.userId))

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteMutation.mutate(profile.id!, {
      onSuccess: () => message.success('档案已删除'),
      onError: (err: Error) => message.error(err?.message ?? '删除失败'),
    })
  }

  return (
    <Card hoverable className="overflow-hidden rounded-2xl border border-slate-200/70 shadow-sm" styles={{ body: { padding: 20 } }} onClick={() => onViewDetail(profile.id!)}>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-lg font-semibold text-cyan-700">{profile.name?.slice(0, 1)}</div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-slate-900">{profile.name}</div>
          <div className="mt-0.5 text-sm text-slate-500">{profile.gender === 'female' ? '女' : '男'} · {profile.age ? `${profile.age} 岁` : ''} · {profile.careLevel || '-'}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Tag color={profile.status === 'active' ? 'green' : 'orange'}>{profile.status === 'active' ? '在档' : '暂停'}</Tag>
        {profile.tags?.slice(0, 2).map((t: string) => <Tag key={t}>{t}</Tag>)}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-400">{profile.updatedAt?.slice(0, 10) ?? ''}</span>
        {showActions && (
          <div className="flex gap-1">
            {canEdit && <Button size="small" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); onEdit(profile) }}>编辑</Button>}
            {canResetPassword && profile.userId && (
              <Button size="small" icon={<ReloadOutlined />} onClick={(e) => {
                e.stopPropagation()
                onResetPassword(profile.userId!, profile.name ?? '-')
              }}>重置密码</Button>
            )}
            {canDelete && <Button size="small" danger icon={<DeleteOutlined />} onClick={handleDelete} loading={deleteMutation.isPending} />}
          </div>
        )}
      </div>
    </Card>
  )
}

function ProfileDetailDrawer({ id, open, onClose }: { id: string; open: boolean; onClose: () => void }) {
  const { data, isLoading } = useGetElderlyProfileQuery(id)
  const profile = data?.data

  if (!open) return null

  return (
    <Drawer title="老人档案详情" open={open} onClose={onClose} width={560}>
      {isLoading ? <Skeleton active paragraph={{ rows: 8 }} /> :
       !profile ? <div className="text-center text-slate-400 py-10">未找到档案</div> : (
        <div className="space-y-4">
          <Descriptions column={1} size="middle" colon={false} className='mb-2!'>
            <Descriptions.Item label="姓名">{profile.name}</Descriptions.Item>
            <Descriptions.Item label="性别">{profile.gender === 'male' ? '男' : '女'}</Descriptions.Item>
            <Descriptions.Item label="生日">{profile.birthday || '-'}</Descriptions.Item>
            <Descriptions.Item label="年龄">{profile.age ?? '-'}</Descriptions.Item>
            <Descriptions.Item label="手机号">{profile.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label="地址">{profile.address || '-'}</Descriptions.Item>
            <Descriptions.Item label="护理级别">{profile.careLevel || '-'}</Descriptions.Item>
            <Descriptions.Item label="状态">{profile.status || '-'}</Descriptions.Item>
          </Descriptions>
          {profile.medicalHistory && <PanelCard title="既往病史"><div className="text-sm text-slate-600">{profile.medicalHistory}</div></PanelCard>}
          <div className="text-xs text-slate-400 mt-2">创建于 {profile.createdAt} · 更新于 {profile.updatedAt}</div>
        </div>
      )}
    </Drawer>
  )
}

function EditProfileModal({ open, profile, onClose }: { open: boolean; profile: ElderlyProfile | null; onClose: () => void }) {
  const [form] = Form.useForm()
  const updateMutation = useUpdateElderlyProfileMutation()

  if (!profile) return null

  return (
    <PopWindow open={open} onClose={onClose} title="编辑老人档案" width={600}>
      <Form form={form} layout="vertical" initialValues={{ ...profile, birthday: profile.birthday ? dayjs(profile.birthday) : undefined }} onFinish={(values: ElderlyProfileUpdateRequest) => {
        updateMutation.mutate({ id: profile.id!, ...values }, {
          onSuccess: () => { message.success('档案更新成功'); onClose() },
          onError: (err: Error) => message.error(err?.message ?? '更新失败'),
        })
      }}>
        <div className="grid gap-0 md:grid-cols-2 md:gap-x-4">
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input disabled placeholder="姓名不可修改" />
          </Form.Item>
          <Form.Item name="gender" label="性别" rules={[{ required: true }]}>
            <Select options={[{ value: 'male', label: '男' }, { value: 'female', label: '女' }]} />
          </Form.Item>
          <Form.Item name="birthday" label="生日" getValueFromEvent={(d: dayjs.Dayjs | null) => d?.format('YYYY-MM-DD')}>
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item name="age" label="年龄"><InputNumber className="w-full" min={0} max={150} /></Form.Item>
          <Form.Item name="phone" label="手机号"><Input /></Form.Item>
          <Form.Item name="address" label="地址"><Input /></Form.Item>
          <Form.Item name="careLevel" label="护理级别">
            <Select options={['A1','A2','A3','B1','B2','C1','C2'].map(v => ({ value: v, label: v }))} />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select options={[{ value: 'active', label: '在档' }, { value: 'inactive', label: '停用' }]} />
          </Form.Item>
        </div>
        <Form.Item name="medicalHistory" label="既往病史"><Input.TextArea rows={3} /></Form.Item>
        <Button type="primary" htmlType="submit" loading={updateMutation.isPending} block size="large">保存修改</Button>
      </Form>
    </PopWindow>
  )
}

function ResetPasswordModal({ open, profileId, profileName, onClose }: { open: boolean; profileId: string; profileName: string; onClose: () => void }) {
  const [form] = Form.useForm()
  const resetMutation = useResetElderlyPasswordMutation()

  return (
    <PopWindow open={open} onClose={onClose} title={`重置密码 - ${profileName}`} width={400}>
      <Form form={form} layout="vertical" onFinish={(v: { newPassword: string }) => {
        resetMutation.mutate({ id: profileId, newPassword: v.newPassword }, {
          onSuccess: () => { message.success('密码已重置'); form.resetFields(); onClose() },
          onError: (err: Error) => message.error(err?.message ?? '重置失败'),
        })
      }}>
        <Form.Item name="newPassword" label="新密码" rules={[{ required: true, min: 6 }]}><Input.Password placeholder="至少 6 位" /></Form.Item>
        <Button type="primary" htmlType="submit" loading={resetMutation.isPending} block>确认重置</Button>
      </Form>
    </PopWindow>
  )
}

export default function ElderlyProfilesPage() {
  const role = useCurrentRoleCode()
  const canCreateOrEdit = role === 'admin' || role === 'doctor'
  const canResetPassword = role === 'admin' || role === 'operator'
  const canDelete = role === 'admin'
  const [createOpen, setCreateOpen] = useState(false)
  const [detailId, setDetailId] = useState('')
  const [resetPwdTarget, setResetPwdTarget] = useState<{ id: string; name: string } | null>(null)
  const [editTarget, setEditTarget] = useState<ElderlyProfile | null>(null)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useListElderlyProfilesQuery({ pageSize: 20 })
  const allProfiles = data?.pages.flatMap(p => p.data?.list ?? []) ?? []

  const sentinelRef = useIntersectionObserver(
    () => { if (hasNextPage && !isFetchingNextPage) fetchNextPage() },
    !isLoading,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-slate-200/80 bg-white px-6 py-5 shadow-sm">
        <div><div className="text-2xl font-semibold text-slate-900">老人档案管理</div><div className="mt-2 text-sm text-slate-500">共 {allProfiles.length} 位在档老人</div></div>
        {canCreateOrEdit && <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>新建档案</Button>}
      </div>
      {isLoading ? <Skeleton active paragraph={{ rows: 6 }} /> : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allProfiles.map(p => (
              <ProfileCard
                key={p.id}
                profile={p}
                canDelete={canDelete}
                canEdit={canCreateOrEdit}
                canResetPassword={canResetPassword}
                onViewDetail={setDetailId}
                onResetPassword={(id, name) => setResetPwdTarget({ id, name })}
                onEdit={setEditTarget}
              />
            ))}
          </div>
          <div ref={sentinelRef} className="h-px" />
          {isFetchingNextPage && <div className="text-center"><Spin /></div>}
        </>
      )}
      {canCreateOrEdit && <CreateProfileModal open={createOpen} onClose={() => setCreateOpen(false)} />}
      <ProfileDetailDrawer id={detailId} open={!!detailId} onClose={() => setDetailId('')} />
      {canResetPassword && resetPwdTarget && <ResetPasswordModal open={!!resetPwdTarget} profileId={resetPwdTarget.id} profileName={resetPwdTarget.name} onClose={() => setResetPwdTarget(null)} />}
      {canCreateOrEdit && <EditProfileModal open={editTarget!==null} profile={editTarget} onClose={() => setEditTarget(null)} />}
    </div>
  )
}
