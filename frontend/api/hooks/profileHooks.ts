import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { ProfileUpdateRequest } from '../models/ProfileUpdateRequest'
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest'
import type { ApiAssessmentReportPage } from '../models/ApiAssessmentReportPage'

export function useGetProfileQuery() {
  return useQuery({ queryKey: ['getProfile'], queryFn: async () => medical.profile.getProfile() })
}

export function useUpdateProfileMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (req: ProfileUpdateRequest) => medical.profile.updateProfile(req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['getProfile'] }); qc.invalidateQueries({ queryKey: ['getCurrentUser'] }) }, mutationKey: ['updateProfile'] })
}

export function useChangePasswordMutation() {
  return useMutation({ mutationFn: async (req: ChangePasswordRequest) => medical.profile.changePassword(req), mutationKey: ['changePassword'] })
}

export function useGetMyElderlyProfileQuery() {
  return useQuery({
    queryKey: ['getMyElderlyProfile'],
    queryFn: async () => medical.profile.getMyElderlyProfile(),
    retry: 1,
  })
}

export function useGetMyAssessmentReportsQuery(params: { pageSize?: number } = {}) {
  const { pageSize = 10 } = params
  return useInfiniteQuery({
    queryKey: ['getMyAssessmentReports'],
    queryFn: async ({ pageParam = 1 }) => medical.profile.getMyAssessmentReports(pageParam, pageSize),
    getNextPageParam: (lastPage: ApiAssessmentReportPage) => { const d = lastPage.data; if (d && d.pageNo! * pageSize < d.total!) return d.pageNo! + 1; return undefined },
    initialPageParam: 1,
  })
}

export function useGetTodosQuery() {
  return useQuery({ queryKey: ['getTodos'], queryFn: async () => medical.profile.getTodos() })
}
