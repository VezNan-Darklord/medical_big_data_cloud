import { Descriptions, Tag, Skeleton, Result, Button } from 'antd'
import {
  MedicineBoxOutlined, TagsOutlined, ManOutlined, WomanOutlined,
} from '@ant-design/icons'
import { useGetCurrentUserQuery } from '../../../api/hooks/authHooks'
import { useGetElderlyProfileQuery } from '../../../api/hooks/elderlyProfileHooks'
import { PanelCard } from '../common'

export default function ElderProfilePage() {
  const { data: userData } = useGetCurrentUserQuery()
  const userId = userData?.data?.id ?? ''

  const { data: profileData, isLoading, error } = useGetElderlyProfileQuery(userId)
  const profile = profileData?.data

  if (!userId) {
    return <Result status="warning" title="无法获取用户信息" subTitle="请确认已登录" />
  }

  if (isLoading) {
    return <Skeleton active paragraph={{ rows: 10 }} className="rounded-[28px] bg-white p-8" />
  }

  if (error || !profile) {
    return (
      <Result
        status="404"
        title="档案未找到"
        subTitle="您的老人档案尚未建立，请联系医生创建。"
        extra={<Button type="primary">联系医生</Button>}
      />
    )
  }

  const genderIcon = profile.gender === 'female'
    ? <WomanOutlined className="text-pink-500" />
    : <ManOutlined className="text-blue-500" />

  const ageText = profile.age ? `${profile.age} 岁` : '-'
  const birthdayText = profile.birthday ?? '-'
  const statusColor = profile.status === 'active' ? 'green' : profile.status === 'inactive' ? 'orange' : 'default'

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* 顶部档案卡片 */}
      <PanelCard
        title={
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-2xl">
              {profile.name?.slice(0, 1)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-semibold text-slate-900">{profile.name}</span>
                {genderIcon}
                <Tag color="blue">{ageText}</Tag>
                <Tag color={statusColor}>{profile.status === 'active' ? '在档' : profile.status === 'inactive' ? '停用' : profile.status}</Tag>
              </div>
              <div className="mt-1 text-sm text-slate-500">ID: {profile.id}</div>
            </div>
          </div>
        }
      >
        <Descriptions column={{ xs: 1, sm: 2, lg: 3 }} size="middle" colon={false}>
          <Descriptions.Item label="生日">{birthdayText}</Descriptions.Item>
          <Descriptions.Item label="手机号">{profile.phone || '-'}</Descriptions.Item>
          <Descriptions.Item label="地址">{profile.address || '-'}</Descriptions.Item>
          <Descriptions.Item label="护理级别">{profile.careLevel || '-'}</Descriptions.Item>
          <Descriptions.Item label="所属机构">{profile.institutionId || '-'}</Descriptions.Item>
          <Descriptions.Item label="建档时间">{profile.createdAt || '-'}</Descriptions.Item>
        </Descriptions>
      </PanelCard>

      {/* 病史 */}
      <PanelCard title={<><MedicineBoxOutlined className="mr-2" />既往病史</>}>
        {profile.medicalHistory ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
            {profile.medicalHistory}
          </div>
        ) : (
          <div className="text-sm text-slate-400">暂无病史记录</div>
        )}
      </PanelCard>

      {/* 标签 */}
      {profile.tags && profile.tags.length > 0 && (
        <PanelCard title={<><TagsOutlined className="mr-2" />标签</>}>
          <div className="flex flex-wrap gap-2">
            {profile.tags.map((tag) => (
              <Tag key={tag} color="processing">{tag}</Tag>
            ))}
          </div>
        </PanelCard>
      )}

      {/* 更新记录 */}
      <div className="text-center text-xs text-slate-400">
        档案最近更新于 {profile.updatedAt || '-'}
      </div>
    </div>
  )
}
