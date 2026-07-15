import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Spin } from 'antd'
import { useGetCurrentUserQuery } from '../../api/hooks/authHooks'
import NotFoundPage from '../components/common/NotFoundPage'
import type { User } from '../../api/models/User'
import { canAccessPath, isElderly } from './const'

export function RoleGuard() {
  const { data, isLoading } = useGetCurrentUserQuery()
  const user = data?.data as User | undefined
  const location = useLocation()

  if (isLoading) {
    return <div className="flex min-h-70 items-center justify-center"><Spin size="large" /></div>
  }

  if (!user) {
    return <Outlet />
  }

  if (!canAccessPath(user.roleCode ?? '', location.pathname)) {
    return <NotFoundPage />
  }

  return <Outlet />
}

export function ElderlyHomeRedirect() {
  const { data } = useGetCurrentUserQuery()
  const user = data?.data as User | undefined

  if (user && isElderly(user.roleCode ?? '')) {
    return <Navigate to="/elderly-profiles" replace />
  }

  return null
}
