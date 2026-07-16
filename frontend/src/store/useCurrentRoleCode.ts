import { useGetCurrentUserQuery } from '../../api/hooks/authHooks'
import type { User } from '../../api/models/User'

export function useCurrentRoleCode() {
  const { data } = useGetCurrentUserQuery()
  return (data?.data as User | undefined)?.roleCode
}

