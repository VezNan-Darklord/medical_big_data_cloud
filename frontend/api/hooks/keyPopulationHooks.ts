import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
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
    getNextPageParam: (lastPage: LastPage) => { const d = lastPage.data; if (d?.pageNo && d.total !== undefined && d.pageNo * pageSize < d.total) return d.pageNo + 1; return undefined },
    initialPageParam: 1,
  })
}

export function useCreateKeyPopulationMutation() {
  return useMutation({ mutationFn: async (req: KeyPopulationCreateRequest) => medical.keyPopulation.createKeyPopulation(req), mutationKey: ['createKeyPopulation'] })
}

export function useUpdateKeyPopulationMutation() {
  return useMutation({ mutationFn: async ({ id, ...req }: KeyPopulationUpdateRequest & { id: string }) => medical.keyPopulation.updateKeyPopulation(id, req), mutationKey: ['updateKeyPopulation'] })
}

export function useDeleteKeyPopulationMutation() {
  return useMutation({ mutationFn: async (id: string) => medical.keyPopulation.deleteKeyPopulation(id), mutationKey: ['deleteKeyPopulation'] })
}

export function useCloseKeyPopulationMutation() {
  return useMutation({ mutationFn: async (id: string) => medical.keyPopulation.closeKeyPopulation(id), mutationKey: ['closeKeyPopulation'] })
}
