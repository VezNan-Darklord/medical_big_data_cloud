import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import medical from '../instance'
import type { ElderlyProfileInput } from '../models/ElderlyProfileInput'
import type { ApiElderlyPage } from '../models/ApiElderlyPage'

type LastPage = ApiElderlyPage

export type ElderlyListParams = {
  keyword?: string
  gender?: 'male' | 'female'
  careLevel?: string
  status?: string
  regionCode?: string
  pageSize?: number
}

export function useListElderlyProfilesQuery(params: ElderlyListParams = {}) {
  const { pageSize = 10, ...filters } = params
  return useInfiniteQuery({
    queryKey: ['listElderlyProfiles', filters],
    queryFn: async ({ pageParam = 1 }) =>
      medical.elderlyProfile.listElderlyProfiles(
        filters.keyword, filters.gender, filters.careLevel, filters.status,
        filters.regionCode, pageParam, pageSize,
      ),
    getNextPageParam: (lastPage: LastPage) => {
      const d = lastPage.data
      if (d && d.pageNo * pageSize < d.total) return d.pageNo + 1
      return undefined
    },
    initialPageParam: 1,
  })
}

export function useCreateElderlyProfileMutation() {
  return useMutation({
    mutationFn: async (req: ElderlyProfileInput) =>
      medical.elderlyProfile.createElderlyProfile(req),
    mutationKey: ['createElderlyProfile'],
  })
}

export function useGetElderlyProfileQuery(id: string) {
  return useQuery({
    queryKey: ['getElderlyProfile', id],
    queryFn: async () => medical.elderlyProfile.getElderlyProfile(id),
    enabled: !!id,
  })
}

export function useUpdateElderlyProfileMutation() {
  return useMutation({
    mutationFn: async ({ id, ...req }: ElderlyProfileInput & { id: string }) =>
      medical.elderlyProfile.updateElderlyProfile(id, req),
    mutationKey: ['updateElderlyProfile'],
  })
}

export function useDeleteElderlyProfileMutation() {
  return useMutation({
    mutationFn: async (id: string) => medical.elderlyProfile.deleteElderlyProfile(id),
    mutationKey: ['deleteElderlyProfile'],
  })
}

export function useGetElderlyWarningsQuery(id: string) {
  return useQuery({
    queryKey: ['getElderlyWarnings', id],
    queryFn: async () => medical.elderlyProfile.getElderlyWarnings(id),
    enabled: !!id,
  })
}

export function useGetElderlyReportsQuery(id: string) {
  return useQuery({
    queryKey: ['getElderlyReports', id],
    queryFn: async () => medical.elderlyProfile.getElderlyReports(id),
    enabled: !!id,
  })
}

export function useGetElderlyDevicesQuery(id: string) {
  return useQuery({
    queryKey: ['getElderlyDevices', id],
    queryFn: async () => medical.elderlyProfile.getElderlyDevices(id),
    enabled: !!id,
  })
}

export function useGetElderlyKeyPopulationsQuery(id: string) {
  return useQuery({
    queryKey: ['getElderlyKeyPopulations', id],
    queryFn: async () => medical.elderlyProfile.getElderlyKeyPopulations(id),
    enabled: !!id,
  })
}
