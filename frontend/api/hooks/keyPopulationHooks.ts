import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
import medical from '../instance'
import type { KeyPopulationCreateRequest } from '../models/KeyPopulationCreateRequest'
import type { KeyPopulationUpdateRequest } from '../models/KeyPopulationUpdateRequest'
import type { ApiResponse_PageResult_KeyPopulationResponse } from '../models/ApiResponse_PageResult_KeyPopulationResponse'

type LastPage = ApiResponse_PageResult_KeyPopulationResponse

export function useListKeyPopulationsQuery(params: { status?: string; pageSize?: number } = {}) {
  const { pageSize = 10, status } = params
  return useInfiniteQuery({
    queryKey: ['listKeyPopulations', { status }],
    queryFn: async ({ pageParam = 1 }) =>
      medical.keyPopulation.listKeyPopulations(status, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => {
      const d = lastPage.data
      if (d && d.pageNo * pageSize < d.total) return d.pageNo + 1
      return undefined
    },
    initialPageParam: 1,
  })
}

export function useCreateKeyPopulationMutation() {
  return useMutation({
    mutationFn: async (req: KeyPopulationCreateRequest) =>
      medical.keyPopulation.createKeyPopulation(req),
    mutationKey: ['createKeyPopulation'],
  })
}

export function useUpdateKeyPopulationMutation() {
  return useMutation({
    mutationFn: async ({ id, ...req }: KeyPopulationUpdateRequest & { id: string }) =>
      medical.keyPopulation.updateKeyPopulation(id, req),
    mutationKey: ['updateKeyPopulation'],
  })
}

export function useCloseKeyPopulationMutation() {
  return useMutation({
    mutationFn: async (id: string) => medical.keyPopulation.closeKeyPopulation(id),
    mutationKey: ['closeKeyPopulation'],
  })
}
