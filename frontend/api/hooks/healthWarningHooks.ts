import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import medical from '../instance'
import type { HealthWarningHandleRequest } from '../models/HealthWarningHandleRequest'
import type { ApiResponse_PageResult_HealthWarningResponse } from '../models/ApiResponse_PageResult_HealthWarningResponse'

type LastPage = ApiResponse_PageResult_HealthWarningResponse

export type WarningListParams = {
  elderlyId?: string; warningType?: string; severity?: string; status?: string; source?: string
  startTime?: string; endTime?: string; pageSize?: number
}

export function useListHealthWarningsQuery(params: WarningListParams = {}) {
  const { pageSize = 10, ...filters } = params
  return useInfiniteQuery({
    queryKey: ['listHealthWarnings', filters],
    queryFn: async ({ pageParam = 1 }) =>
      medical.healthWarning.listHealthWarnings(
        filters.elderlyId, filters.warningType, filters.severity, filters.status,
        filters.source, filters.startTime, filters.endTime, pageParam, pageSize,
      ),
    getNextPageParam: (lastPage: LastPage) => {
      const d = lastPage.data
      if (d && d.pageNo * pageSize < d.total) return d.pageNo + 1
      return undefined
    },
    initialPageParam: 1,
  })
}

export function useGetHealthWarningQuery(id: string) {
  return useQuery({
    queryKey: ['getHealthWarning', id],
    queryFn: async () => medical.healthWarning.getHealthWarningById(id),
    enabled: !!id,
  })
}

export function useHandleHealthWarningMutation() {
  return useMutation({
    mutationFn: async ({ id, ...req }: HealthWarningHandleRequest & { id: string }) =>
      medical.healthWarning.handleHealthWarning(id, req),
    mutationKey: ['handleHealthWarning'],
  })
}

export function useAssignHealthWarningMutation() {
  return useMutation({
    mutationFn: async ({ id, targetDoctorId }: { id: string; targetDoctorId: string }) =>
      medical.healthWarning.assignHealthWarning(id, targetDoctorId),
    mutationKey: ['assignHealthWarning'],
  })
}
