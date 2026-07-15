import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { UserCreateRequest } from '../models/UserCreateRequest'
import type { UserUpdateRequest } from '../models/UserUpdateRequest'
import type { UserStatusUpdateRequest } from '../models/UserStatusUpdateRequest'
import type { RoleAssignRequest } from '../models/RoleAssignRequest'
import type { ApiUserPage } from '../models/ApiUserPage'

type LastPage = ApiUserPage

export function useListUsersQuery(params: { keyword?: string; roleCode?: string; status?: 'enabled' | 'disabled'; pageSize?: number } = {}) {
  const { pageSize = 10, ...filters } = params
  return useInfiniteQuery({
    queryKey: ['listUsers', filters],
    queryFn: async ({ pageParam = 1 }) => medical.userAccount.listUsers(filters.keyword, filters.roleCode as any, filters.status, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => { const d = lastPage.data; if (d && d.pageNo! * pageSize < d.total!) return d.pageNo! + 1; return undefined },
    initialPageParam: 1,
  })
}

export function useCreateUserMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (req: UserCreateRequest) => medical.userAccount.createUser(req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listUsers'] }) }, mutationKey: ['createUser'] })
}

export function useGetUserQuery(id: string) {
  return useQuery({ queryKey: ['getUser', id], queryFn: async () => medical.userAccount.getUser(id), enabled: !!id })
}

export function useUpdateUserMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async ({ id, ...req }: UserUpdateRequest & { id: string }) => medical.userAccount.updateUser(id, req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listUsers'] }) }, mutationKey: ['updateUser'] })
}

export function useDeleteUserMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (id: string) => medical.userAccount.deleteUser(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listUsers'] }) }, mutationKey: ['deleteUser'] })
}

export function useUpdateUserStatusMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async ({ id, ...req }: UserStatusUpdateRequest & { id: string }) => medical.userAccount.updateUserStatus(id, req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listUsers'] }) }, mutationKey: ['updateUserStatus'] })
}

export function useAssignUserRoleMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async ({ id, ...req }: RoleAssignRequest & { id: string }) => medical.userAccount.assignUserRole(id, req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listUsers'] }) }, mutationKey: ['assignUserRole'] })
}
