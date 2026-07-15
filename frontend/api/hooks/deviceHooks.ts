import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { DeviceBindRequest } from '../models/DeviceBindRequest'
import type { DeviceCreateRequest } from '../models/DeviceCreateRequest'
import type { DeviceUpdateRequest } from '../models/DeviceUpdateRequest'
import type { DeviceDataReportRequest } from '../models/DeviceDataReportRequest'
import type { ApiDevicePage } from '../models/ApiDevicePage'

type LastPage = ApiDevicePage

export function useListDevicesQuery(params: { bindingStatus?: 'bound' | 'unbound'; onlineStatus?: 'online' | 'offline'; pageSize?: number } = {}) {
  const { pageSize = 10, bindingStatus, onlineStatus } = params
  return useInfiniteQuery({
    queryKey: ['listDevices', { bindingStatus, onlineStatus }],
    queryFn: async ({ pageParam = 1 }) => medical.device.listDevices(bindingStatus, onlineStatus, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => { const d = lastPage.data; if (d && d.pageNo! * pageSize < d.total!) return d.pageNo! + 1; return undefined },
    initialPageParam: 1,
  })
}

export function useCreateDeviceMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (req: DeviceCreateRequest) => medical.device.createDevice(req),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['listDevices'] }) },
    mutationKey: ['createDevice'],
  })
}

export function useGetDeviceQuery(id: string) {
  return useQuery({ queryKey: ['getDevice', id], queryFn: async () => medical.device.getDevice(id), enabled: !!id })
}

export function useUpdateDeviceMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...req }: DeviceUpdateRequest & { id: string }) => medical.device.updateDevice(id, req),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['listDevices'] }); qc.invalidateQueries({ queryKey: ['getDevice'] }) },
    mutationKey: ['updateDevice'],
  })
}

export function useDeleteDeviceMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => medical.device.deleteDevice(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['listDevices'] }) },
    mutationKey: ['deleteDevice'],
  })
}

export function useBindDeviceMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (req: DeviceBindRequest) => medical.device.bindDevice(req),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['listDevices'] }) },
    mutationKey: ['bindDevice'],
  })
}

export function useUnbindDeviceMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => medical.device.unbindDevice(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['listDevices'] }) },
    mutationKey: ['unbindDevice'],
  })
}

export function useGetDeviceReportsQuery(id: string) {
  return useQuery({ queryKey: ['getDeviceReports', id], queryFn: async () => medical.device.getDeviceReports(id), enabled: !!id })
}

export function useRecordDeviceReportMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...req }: DeviceDataReportRequest & { id: string }) => medical.device.recordDeviceReport(id, req),
    onSuccess: (_data, vars) => { qc.invalidateQueries({ queryKey: ['getDeviceReports', vars.id] }) },
    mutationKey: ['recordDeviceReport'],
  })
}
