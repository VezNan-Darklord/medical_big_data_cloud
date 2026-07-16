import { Navigate } from 'react-router-dom'
import { Spin } from 'antd'
import { useGetCurrentUserQuery } from '../../../api/hooks/authHooks'
import type { User } from '../../../api/models/User'
import LandingPage from './LandingPage'

export default function HomePage() {
  const { data, isLoading } = useGetCurrentUserQuery()
  const user = data?.data as User | undefined
  const role = user?.roleCode ?? ''

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (role === 'elderly') return <Navigate to="/elderly-profiles" replace />
  if (role === 'doctor') return <Navigate to="/health-warnings" replace />
  if (role === 'admin') return <Navigate to="/report-statistics" replace />

  return <LandingPage />
}
