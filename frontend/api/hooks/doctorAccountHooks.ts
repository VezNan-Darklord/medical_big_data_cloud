import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { UserUpdateRequest } from '../models/UserUpdateRequest'
import type { PasswordRequest } from '../models/PasswordRequest'
import type { SpecializedUserCreateRequest } from '../models/SpecializedUserCreateRequest'
import type { ApiUserPage } from '../models/ApiUserPage'
import { useCurrentRoleCode } from '../../src/store/useCurrentRoleCode'

type LastPage = ApiUserPage

export function useListDoctorAccountsQuery(params: { status?: 'enabled' | 'disabled'; pageSize?: number } = {}) {
  const roleCode = useCurrentRoleCode();
  const { pageSize = 10, status } = params
  return useInfiniteQuery({
    queryKey: ['listDoctorAccounts', { status }],
    queryFn: async ({ pageParam = 1 }) => medical.doctorAccount.listDoctorAccounts(status, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => { const d = lastPage.data; if (d && d.pageNo! * pageSize < d.total!) return d.pageNo! + 1; return undefined },
    initialPageParam: 1,
    enabled: roleCode === 'admin',
  })
}

export function useCreateDoctorAccountMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (req: SpecializedUserCreateRequest) => medical.doctorAccount.createDoctorAccount(req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listDoctorAccounts'] }) }, mutationKey: ['createDoctorAccount'] })
}

export function useUpdateDoctorAccountMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async ({ id, ...req }: UserUpdateRequest & { id: string }) => medical.doctorAccount.updateDoctorAccount(id, req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listDoctorAccounts'] }) }, mutationKey: ['updateDoctorAccount'] })
}

export function useResetDoctorPasswordMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async ({ id, ...req }: PasswordRequest & { id: string }) => medical.doctorAccount.resetDoctorPassword(id, req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listDoctorAccounts'] }) }, mutationKey: ['resetDoctorPassword'] })
}
