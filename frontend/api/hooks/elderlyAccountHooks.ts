import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { UserStatusUpdateRequest } from '../models/UserStatusUpdateRequest'
import type { PasswordRequest } from '../models/PasswordRequest'
import type { SpecializedUserCreateRequest } from '../models/SpecializedUserCreateRequest'
import type { ApiUserPage } from '../models/ApiUserPage'
import { useCurrentRoleCode } from '../../src/store/useCurrentRoleCode'

type LastPage = ApiUserPage

export function useListElderlyAccountsQuery(params: { status?: 'enabled' | 'disabled'; pageSize?: number } = {}) {
  const roleCode = useCurrentRoleCode();
  const { pageSize = 10, status } = params
  return useInfiniteQuery({
    queryKey: ['listElderlyAccounts', { status }],
    queryFn: async ({ pageParam = 1 }) => medical.elderlyAccount.listElderlyAccounts(status, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => { const d = lastPage.data; if (d && d.pageNo! * pageSize < d.total!) return d.pageNo! + 1; return undefined },
    initialPageParam: 1,
    enabled: roleCode!=='elderly',
  })
}

export function useCreateElderlyAccountMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (req: SpecializedUserCreateRequest) => medical.elderlyAccount.createElderlyAccount(req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listElderlyAccounts'] }) }, mutationKey: ['createElderlyAccount'] })
}

export function useResetElderlyPasswordMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async ({ id, ...req }: PasswordRequest & { id: string }) => medical.elderlyAccount.resetElderlyPassword(id, req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listElderlyAccounts'] }) }, mutationKey: ['resetElderlyPassword'] })
}

export function useUpdateElderlyAccountStatusMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async ({ id, ...req }: UserStatusUpdateRequest & { id: string }) => medical.elderlyAccount.updateElderlyAccountStatus(id, req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listElderlyAccounts'] }) }, mutationKey: ['updateElderlyAccountStatus'] })
}
