import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import medical from '../instance'
import type { UserUpdateRequest } from '../models/UserUpdateRequest'
import type { ApiResponse_PageResult_UserResponse } from '../models/ApiResponse_PageResult_UserResponse'

type LastPage = ApiResponse_PageResult_UserResponse

export function useListDoctorAccountsQuery(params: { pageSize?: number } = {}) {
  const { pageSize = 10 } = params
  return useInfiniteQuery({
    queryKey: ['listDoctorAccounts'],
    queryFn: async ({ pageParam = 1 }) =>
      medical.doctorAccount.listDoctorAccounts(pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => {
      const d = lastPage.data
      if (d && d.pageNo * pageSize < d.total) return d.pageNo + 1
      return undefined
    },
    initialPageParam: 1,
  })
}

export function useUpdateDoctorAccountMutation() {
  return useMutation({
    mutationFn: async ({ id, ...req }: UserUpdateRequest & { id: string }) =>
      medical.doctorAccount.updateDoctorAccount(id, req),
    mutationKey: ['updateDoctorAccount'],
  })
}

export function useResetDoctorPasswordMutation() {
  return useMutation({
    mutationFn: async ({ id, newPassword }: { id: string; newPassword: string }) =>
      medical.doctorAccount.resetDoctorAccountPassword(id, newPassword),
    mutationKey: ['resetDoctorPassword'],
  })
}
