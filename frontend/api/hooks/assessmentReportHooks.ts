import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { AssessmentReportCreateRequest } from '../models/AssessmentReportCreateRequest'

export function useAssessmentReportsQuery(elderlyId?: string) {
  return useQuery({
    queryKey: ['assessmentReports', elderlyId],
    queryFn: () => medical.assessmentReport.listAssessmentReports(elderlyId, 1, 100),
  })
}

export function useCreateAssessmentReportMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (request: AssessmentReportCreateRequest) =>
      medical.assessmentReport.createAssessmentReport(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assessmentReports'] }),
  })
}

export function useDeleteAssessmentReportMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => medical.assessmentReport.deleteAssessmentReport(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['assessmentReports'] }),
  })
}

export function useExportAssessmentReportMutation() {
  return useMutation({
    mutationFn: (id: string) => medical.assessmentReport.exportAssessmentReport(id),
    onSuccess: (blob, id) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `assessment-report-${id}.md`
      link.click()
      URL.revokeObjectURL(url)
    },
  })
}
