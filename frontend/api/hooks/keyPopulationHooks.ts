import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { KeyPopulationCreateRequest } from '../models/KeyPopulationCreateRequest'
import type { KeyPopulationUpdateRequest } from '../models/KeyPopulationUpdateRequest'
import type { ApiKeyPopulationPage } from '../models/ApiKeyPopulationPage'

type LastPage = ApiKeyPopulationPage

export function useListKeyPopulationsQuery(params: { status?: 'active' | 'closed'; pageSize?: number } = {}) {
  const { pageSize = 10, status } = params
  return useInfiniteQuery({
    queryKey: ['listKeyPopulations', { status }],
    queryFn: async ({ pageParam = 1 }) => medical.keyPopulation.listKeyPopulations(status, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => { const d = lastPage.data; if (d && d.pageNo! * pageSize < d.total!) return d.pageNo! + 1; return undefined },
    initialPageParam: 1,
  })
}

export function useCreateKeyPopulationMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (req: KeyPopulationCreateRequest) => medical.keyPopulation.createKeyPopulation(req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listKeyPopulations'] }) }, mutationKey: ['createKeyPopulation'] })
}

export function useGetKeyPopulationQuery(id: string) {
  return useQuery({ queryKey: ['getKeyPopulation', id], queryFn: async () => medical.keyPopulation.getKeyPopulation(id), enabled: !!id })
}

export function useUpdateKeyPopulationMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async ({ id, ...req }: KeyPopulationUpdateRequest & { id: string }) => medical.keyPopulation.updateKeyPopulation(id, req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listKeyPopulations'] }) }, mutationKey: ['updateKeyPopulation'] })
}

export function useDeleteKeyPopulationMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (id: string) => medical.keyPopulation.deleteKeyPopulation(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listKeyPopulations'] }) }, mutationKey: ['deleteKeyPopulation'] })
}

export function useCloseKeyPopulationMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (id: string) => medical.keyPopulation.closeKeyPopulation(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listKeyPopulations'] }) }, mutationKey: ['closeKeyPopulation'] })
}
