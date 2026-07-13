import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import medical from '../instance'
import type { UserUpdateRequest } from '../models/UserUpdateRequest'
import type { StatusRequest } from '../models/StatusRequest'
import type { ApiObjectPage } from '../models/ApiObjectPage'

type LastPage = ApiObjectPage

export function useListUsersQuery(params: { keyword?: string; roleCode?: string; status?: string; pageSize?: number } = {}) {
  const { pageSize = 10, ...filters } = params
  return useInfiniteQuery({
    queryKey: ['listUsers', filters],
    queryFn: async ({ pageParam = 1 }) =>
      medical.userAccount.listUsers(filters.keyword, filters.roleCode, filters.status, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => {
      const d = lastPage.data
      if (d && d.pageNo * pageSize < d.total) return d.pageNo + 1
      return undefined
    },
    initialPageParam: 1,
  })
}

export function useGetUserQuery(id: string) {
  return useQuery({
    queryKey: ['getUser', id],
    queryFn: async () => medical.userAccount.getUser(id),
    enabled: !!id,
  })
}

export function useUpdateUserMutation() {
  return useMutation({
    mutationFn: async ({ id, ...req }: UserUpdateRequest & { id: string }) =>
      medical.userAccount.updateUser(id, req),
    mutationKey: ['updateUser'],
  })
}

export function useUpdateUserStatusMutation() {
  return useMutation({
    mutationFn: async ({ id, ...req }: StatusRequest & { id: string }) =>
      medical.userAccount.updateUserStatus(id, req),
    mutationKey: ['updateUserStatus'],
  })
}

export function useAssignUserRoleMutation() {
  return useMutation({
    mutationFn: async ({ id, roleCode }: { id: string; roleCode: string }) =>
      medical.userAccount.assignUserRole(id, roleCode),
    mutationKey: ['assignUserRole'],
  })
}
