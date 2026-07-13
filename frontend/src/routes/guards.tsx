import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useGetCurrentUserQuery } from '../../api/hooks/authHooks'
import NotFoundPage from '../components/common/NotFoundPage'
import type { User } from '../../api/models/User'
import { ELDERLY_ALLOWED, isElderly } from './const'

export function RoleGuard() {
  const { data } = useGetCurrentUserQuery()
  const user = data?.data as User | undefined
  const location = useLocation()

  if (!user) {
    return <Outlet />
  }

  if (isElderly(user.roleCode ?? '') && !ELDERLY_ALLOWED.has(location.pathname)) {
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
