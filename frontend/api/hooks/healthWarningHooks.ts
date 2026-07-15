import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { HealthWarningCreateRequest } from '../models/HealthWarningCreateRequest'
import type { HealthWarningHandleRequest } from '../models/HealthWarningHandleRequest'
import type { HealthWarningAssignRequest } from '../models/HealthWarningAssignRequest'
import type { ApiWarningPage } from '../models/ApiWarningPage'

type LastPage = ApiWarningPage

export type WarningListParams = {
  elderlyId?: string; warningType?: string; severity?: 'low' | 'medium' | 'high' | 'critical'
  status?: 'unprocessed' | 'processing' | 'processed' | 'closed'; source?: string
  startTime?: string; endTime?: string; pageSize?: number
}

export function useListHealthWarningsQuery(params: WarningListParams = {}) {
  const { pageSize = 10, ...filters } = params
  return useInfiniteQuery({
    queryKey: ['listHealthWarnings', filters],
    queryFn: async ({ pageParam = 1 }) => medical.healthWarning.listHealthWarnings(
      filters.elderlyId, filters.warningType, filters.severity, filters.status, filters.source, filters.startTime, filters.endTime, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => { const d = lastPage.data; if (d && d.pageNo! * pageSize < d.total!) return d.pageNo! + 1; return undefined },
    initialPageParam: 1,
  })
}

export function useCreateHealthWarningMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (req: HealthWarningCreateRequest) => medical.healthWarning.createHealthWarning(req),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['listHealthWarnings'] }) },
    mutationKey: ['createHealthWarning'],
  })
}

export function useGetHealthWarningQuery(id: string) {
  return useQuery({ queryKey: ['getHealthWarning', id], queryFn: async () => medical.healthWarning.getHealthWarning(id), enabled: !!id })
}

export function useDeleteHealthWarningMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => medical.healthWarning.deleteHealthWarning(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['listHealthWarnings'] }) },
    mutationKey: ['deleteHealthWarning'],
  })
}

export function useHandleHealthWarningMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...req }: HealthWarningHandleRequest & { id: string }) => medical.healthWarning.handleHealthWarning(id, req),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['listHealthWarnings'] }); qc.invalidateQueries({ queryKey: ['getHealthWarning'] }) },
    mutationKey: ['handleHealthWarning'],
  })
}

export function useAssignHealthWarningMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...req }: HealthWarningAssignRequest & { id: string }) => medical.healthWarning.assignHealthWarning(id, req),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['listHealthWarnings'] }) },
    mutationKey: ['assignHealthWarning'],
  })
}
