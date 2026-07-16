import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { AssessmentReportCreateRequest } from '../models/AssessmentReportCreateRequest'
import type { AssessmentReportReviewRequest } from '../models/AssessmentReportReviewRequest'
import type { AssessmentReportUpdateRequest } from '../models/AssessmentReportUpdateRequest'
import type { ApiAssessmentReportPage } from '../models/ApiAssessmentReportPage'

type LastPage = ApiAssessmentReportPage

export function useListAssessmentReportsQuery(params: { elderlyId?: string; pageSize?: number } = {}) {
  const { pageSize = 10, elderlyId } = params
  return useInfiniteQuery({
    queryKey: ['listAssessmentReports', { elderlyId }],
    queryFn: async ({ pageParam = 1 }) => medical.assessmentReport.listAssessmentReports(elderlyId, pageParam, pageSize),
    getNextPageParam: (lastPage: LastPage) => { const d = lastPage.data; if (d && d.pageNo! * pageSize < d.total!) return d.pageNo! + 1; return undefined },
    initialPageParam: 1,
  })
}

export function useCreateAssessmentReportMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (req: AssessmentReportCreateRequest) => medical.assessmentReport.createAssessmentReport(req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listAssessmentReports'] }) }, mutationKey: ['createAssessmentReport'] })
}

export function useGetAssessmentReportQuery(id: string) {
  return useQuery({ queryKey: ['getAssessmentReport', id], queryFn: async () => medical.assessmentReport.getAssessmentReport(id), enabled: !!id })
}

export function useDeleteAssessmentReportMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async (id: string) => medical.assessmentReport.deleteAssessmentReport(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listAssessmentReports'] }) }, mutationKey: ['deleteAssessmentReport'] })
}

export function useReviewAssessmentReportMutation() {
  const qc = useQueryClient()
  return useMutation({ mutationFn: async ({ id, ...req }: AssessmentReportReviewRequest & { id: string }) => medical.assessmentReport.reviewAssessmentReport(id, req), onSuccess: () => { qc.invalidateQueries({ queryKey: ['listAssessmentReports'] }); qc.invalidateQueries({ queryKey: ['getAssessmentReport'] }) }, mutationKey: ['reviewAssessmentReport'] })
}

export function useExportAssessmentReportQuery(id: string) {
  return useQuery({
    queryKey: ['exportAssessmentReport', id],
    queryFn: async () => medical.assessmentReport.exportAssessmentReport(id),
  })
}

export function useUpdateAssessmentReportMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...req }: AssessmentReportUpdateRequest & { id: string }) =>
      medical.assessmentReport.updateAssessmentReport(id, req),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: ['listAssessmentReports'] })
      qc.invalidateQueries({ queryKey: ['getAssessmentReport', variables.id] })
      qc.invalidateQueries({ queryKey: ['getMyAssessmentReports'] })
    },
    mutationKey: ['updateAssessmentReport'],
  })
}
