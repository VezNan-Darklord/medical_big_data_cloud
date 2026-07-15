import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import medical from '../instance'
import type { DeviceBindRequest } from '../models/DeviceBindRequest'
import type { DeviceCreateRequest } from '../models/DeviceCreateRequest'
import type { DeviceUpdateRequest } from '../models/DeviceUpdateRequest'
import type { ApiDevicePage } from '../models/ApiDevicePage'

type LastPage = ApiDevicePage

export function useListDevicesQuery(params: { bindingStatus?: 'bound' | 'unbound'; onlineStatus?: 'online' | 'offline'; pageSize?: number } = {}) {
  const { pageSize = 10, bindingStatus, onlineStatus } = params
  return useInfiniteQuery({
    queryKey: ['listDevices', { bindingStatus, onlineStatus }],
    queryFn: async ({ pageParam = 1 }) => medical.device.listDevices(bindingStatus, onlineStatus, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => { const d = lastPage.data; if (d?.pageNo && d.total !== undefined && d.pageNo * pageSize < d.total) return d.pageNo + 1; return undefined },
    initialPageParam: 1,
  })
}

export function useCreateDeviceMutation() {
  return useMutation({ mutationFn: async (req: DeviceCreateRequest) => medical.device.createDevice(req), mutationKey: ['createDevice'] })
}

export function useGetDeviceQuery(id: string) {
  return useQuery({ queryKey: ['getDevice', id], queryFn: async () => medical.device.getDevice(id), enabled: !!id })
}

export function useUpdateDeviceMutation() {
  return useMutation({ mutationFn: async ({ id, ...req }: DeviceUpdateRequest & { id: string }) => medical.device.updateDevice(id, req), mutationKey: ['updateDevice'] })
}

export function useDeleteDeviceMutation() {
  return useMutation({ mutationFn: async (id: string) => medical.device.deleteDevice(id), mutationKey: ['deleteDevice'] })
}

export function useBindDeviceMutation() {
  return useMutation({ mutationFn: async (req: DeviceBindRequest) => medical.device.bindDevice(req), mutationKey: ['bindDevice'] })
}

export function useUnbindDeviceMutation() {
  return useMutation({ mutationFn: async (id: string) => medical.device.unbindDevice(id), mutationKey: ['unbindDevice'] })
}

export function useGetDeviceReportsQuery(id: string) {
  return useQuery({ queryKey: ['getDeviceReports', id], queryFn: async () => medical.device.getDeviceReports(id), enabled: !!id })
}
