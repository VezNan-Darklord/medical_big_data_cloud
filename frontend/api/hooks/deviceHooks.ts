import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { DeviceBindRequest } from '../models/DeviceBindRequest'
import type { DeviceUpdateRequest } from '../models/DeviceUpdateRequest'
import type { ApiObjectPage } from '../models/ApiObjectPage'
import type { DeviceCreateRequest } from '../models/DeviceCreateRequest'

type LastPage = ApiObjectPage

export function useListDevicesQuery(params: { bindingStatus?: string; onlineStatus?: string; pageSize?: number } = {}) {
  const { pageSize = 10, bindingStatus, onlineStatus } = params
  return useInfiniteQuery({
    queryKey: ['listDevices', { bindingStatus, onlineStatus }],
    queryFn: async ({ pageParam = 1 }) =>
      medical.device.listDevices(bindingStatus, onlineStatus, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => {
      const d = lastPage.data
      if (d && d.pageNo * pageSize < d.total) return d.pageNo + 1
      return undefined
    },
    initialPageParam: 1,
  })
}

export function useGetDeviceQuery(id: string) {
  return useQuery({
    queryKey: ['getDevice', id],
    queryFn: async () => medical.device.getDevice(id),
    enabled: !!id,
  })
}

export function useCreateDeviceMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: DeviceCreateRequest) => medical.device.createDevice(req),
    mutationKey: ['createDevice'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listDevices'] })
    }
  });
}

export function useUpdateDeviceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...req }: DeviceUpdateRequest & { id: string }) =>
      medical.device.updateDevice(id, req),
    mutationKey: ['updateDevice'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listDevices'] })
    },
  })
}

export function useBindDeviceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (req: DeviceBindRequest) => medical.device.bindDevice(req),
    mutationKey: ['bindDevice'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listDevices'] })
    },
  })
}

export function useUnbindDeviceMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => medical.device.unbindDevice(id),
    mutationKey: ['unbindDevice'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listDevices'] })
    },
  })
}

export function useGetDeviceReportsQuery(id: string) {
  return useQuery({
    queryKey: ['getDeviceReports', id],
    queryFn: async () => medical.device.getDeviceReports(id),
    enabled: !!id,
  })
}
