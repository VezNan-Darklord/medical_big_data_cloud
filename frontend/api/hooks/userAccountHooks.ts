import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import medical from '../instance'
import type { UserUpdateRequest } from '../models/UserUpdateRequest'
import type { UserStatusUpdateRequest } from '../models/UserStatusUpdateRequest'
import type { ApiResponse_PageResult_UserResponse } from '../models/ApiResponse_PageResult_UserResponse'

type LastPage = ApiResponse_PageResult_UserResponse

export function useListUsersQuery(params: { keyword?: string; pageSize?: number } = {}) {
  const { pageSize = 10, keyword } = params
  return useInfiniteQuery({
    queryKey: ['listUsers', { keyword }],
    queryFn: async ({ pageParam = 1 }) =>
      medical.userAccount.listUsers(keyword, pageParam, pageSize),
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
    queryFn: async () => medical.userAccount.getUserById(id),
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
    mutationFn: async ({ id, ...req }: UserStatusUpdateRequest & { id: string }) =>
      medical.userAccount.updateUserStatus(id, req),
    mutationKey: ['updateUserStatus'],
  })
}

export function useAssignUserRoleMutation() {
  return useMutation({
    mutationFn: async ({ id, roleCode }: { id: string; roleCode: string }) =>
      medical.userAccount.assignRoles(id, roleCode),
    mutationKey: ['assignUserRole'],
  })
}
