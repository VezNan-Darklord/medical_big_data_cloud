import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import medical from '../instance'
import type { StatusRequest } from '../models/StatusRequest'
import type { ApiObjectPage } from '../models/ApiObjectPage'

type LastPage = ApiObjectPage

export function useListElderlyAccountsQuery(params: { pageSize?: number } = {}) {
  const { pageSize = 10 } = params
  return useInfiniteQuery({
    queryKey: ['listElderlyAccounts'],
    queryFn: async ({ pageParam = 1 }) =>
      medical.elderlyAccount.listElderlyAccounts(pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => {
      const d = lastPage.data
      if (d && d.pageNo * pageSize < d.total) return d.pageNo + 1
      return undefined
    },
    initialPageParam: 1,
  })
}

export function useResetElderlyPasswordMutation() {
  return useMutation({
    mutationFn: async ({ id, newPassword }: { id: string; newPassword: string }) =>
      medical.elderlyAccount.resetElderlyPassword(id, newPassword),
    mutationKey: ['resetElderlyPassword'],
  })
}

export function useUpdateElderlyAccountStatusMutation() {
  return useMutation({
    mutationFn: async ({ id, ...req }: StatusRequest & { id: string }) =>
      medical.elderlyAccount.updateElderlyAccountStatus(id, req),
    mutationKey: ['updateElderlyAccountStatus'],
  })
}
