import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { ElderlyProfileCreateRequest } from '../models/ElderlyProfileCreateRequest'
import type { ElderlyProfileUpdateRequest } from '../models/ElderlyProfileUpdateRequest'
import type { ApiElderlyPage } from '../models/ApiElderlyPage'

type LastPage = ApiElderlyPage

export type ElderlyListParams = {
  keyword?: string;
  gender?: 'male' | 'female' | 'unknown';
  careLevel?: string;
  status?: 'active' | 'inactive';
  regionCode?: string;
  pageSize?: number
}

export function useListElderlyProfilesQuery(params: ElderlyListParams = {}) {
  const { pageSize = 10, ...filters } = params
  return useInfiniteQuery({
    queryKey: ['listElderlyProfiles', filters],
    queryFn: async ({ pageParam = 1 }) =>
      medical.elderlyProfile.listElderlyProfiles(filters.keyword, filters.gender, filters.careLevel, filters.status, filters.regionCode, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => { const d = lastPage.data; if (d?.pageNo && d.total !== undefined && d.pageNo * pageSize < d.total) return d.pageNo + 1; return undefined },
    initialPageParam: 1,
  })
}

export function useCreateElderlyProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (req: ElderlyProfileCreateRequest) => medical.elderlyProfile.createElderlyProfile(req),
    mutationKey: ['createElderlyProfile'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listElderlyProfiles'] })
    }
  })
}

export function useGetElderlyProfileQuery(id: string) {
  return useQuery({ queryKey: ['getElderlyProfile', id], queryFn: async () => medical.elderlyProfile.getElderlyProfile(id), enabled: !!id })
}

export function useUpdateElderlyProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...req }: ElderlyProfileUpdateRequest & { id: string }) => medical.elderlyProfile.updateElderlyProfile(id, req),
    mutationKey: ['updateElderlyProfile'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listElderlyProfiles'] })
    }
  })
}

export function useDeleteElderlyProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => medical.elderlyProfile.deleteElderlyProfile(id),
    mutationKey: ['deleteElderlyProfile'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listElderlyProfiles'] })
    }
  })
}

