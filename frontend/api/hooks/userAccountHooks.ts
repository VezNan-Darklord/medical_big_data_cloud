import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import medical from '../instance'
import type { UserUpdateRequest } from '../models/UserUpdateRequest'
import type { ApiUserPage } from '../models/ApiUserPage'
import type { RoleCode } from '../models/RoleCode'

type LastPage = ApiUserPage

export function useListUsersQuery(params: { keyword?: string; roleCode?: RoleCode; status?: 'enabled' | 'disabled'; pageSize?: number } = {}) {
  const { pageSize = 10, ...filters } = params
  return useInfiniteQuery({
    queryKey: ['listUsers', filters],
    queryFn: async ({ pageParam = 1 }) => medical.userAccount.listUsers(filters.keyword, filters.roleCode, filters.status, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => { const d = lastPage.data; if (d?.pageNo && d.total !== undefined && d.pageNo * pageSize < d.total) return d.pageNo + 1; return undefined },
    initialPageParam: 1,
  })
}

export function useGetUserQuery(id: string) {
  return useQuery({ queryKey: ['getUser', id], queryFn: async () => medical.userAccount.getUser(id), enabled: !!id })
}

export function useUpdateUserMutation() {
  return useMutation({ mutationFn: async ({ id, ...req }: UserUpdateRequest & { id: string }) => medical.userAccount.updateUser(id, req), mutationKey: ['updateUser'] })
}

export function useDeleteUserMutation() {
  return useMutation({ mutationFn: async (id: string) => medical.userAccount.deleteUser(id), mutationKey: ['deleteUser'] })
}

export function useAssignUserRoleMutation() {
  return useMutation({ mutationFn: async ({ id, roleCode }: { id: string; roleCode: RoleCode }) => medical.userAccount.assignUserRole(id, { roleCode }), mutationKey: ['assignUserRole'] })
}
