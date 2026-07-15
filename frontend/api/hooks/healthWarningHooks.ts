import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import medical from '../instance'
import type { HealthWarningCreateRequest } from '../models/HealthWarningCreateRequest'
import type { WarningHandleRequest } from '../models/WarningHandleRequest'
import type { ApiWarningPage } from '../models/ApiWarningPage'

type LastPage = ApiWarningPage

export type WarningListParams = {
  elderlyId?: string; warningType?: string; severity?: 'low' | 'medium' | 'high' | 'critical'; status?: string; source?: string
  startTime?: string; endTime?: string; pageSize?: number
}

export function useListHealthWarningsQuery(params: WarningListParams = {}) {
  const { pageSize = 10, ...filters } = params
  return useInfiniteQuery({
    queryKey: ['listHealthWarnings', filters],
    queryFn: async ({ pageParam = 1 }) => medical.healthWarning.listHealthWarnings(filters.elderlyId, filters.warningType, filters.severity, filters.status, filters.source, filters.startTime, filters.endTime, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => { const d = lastPage.data; if (d && d.pageNo * pageSize < d.total) return d.pageNo + 1; return undefined },
    initialPageParam: 1,
  })
}

export function useCreateHealthWarningMutation() {
  return useMutation({ mutationFn: async (req: HealthWarningCreateRequest) => medical.healthWarning.createHealthWarning(req), mutationKey: ['createHealthWarning'] })
}

export function useGetHealthWarningQuery(id: string) {
  return useQuery({ queryKey: ['getHealthWarning', id], queryFn: async () => medical.healthWarning.getHealthWarning(id), enabled: !!id })
}

export function useDeleteHealthWarningMutation() {
  return useMutation({ mutationFn: async (id: string) => medical.healthWarning.deleteHealthWarning(id), mutationKey: ['deleteHealthWarning'] })
}

export function useHandleHealthWarningMutation() {
  return useMutation({ mutationFn: async ({ id, ...req }: WarningHandleRequest & { id: string }) => medical.healthWarning.handleHealthWarning(id, req), mutationKey: ['handleHealthWarning'] })
}

export function useAssignHealthWarningMutation() {
  return useMutation({ mutationFn: async ({ id, targetDoctorId }: { id: string; targetDoctorId: string }) => medical.healthWarning.assignHealthWarning(id, targetDoctorId), mutationKey: ['assignHealthWarning'] })
}
