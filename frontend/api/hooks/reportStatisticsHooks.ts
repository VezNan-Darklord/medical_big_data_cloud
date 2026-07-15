import { useMutation, useQuery } from '@tanstack/react-query'
import medical from '../instance'

export function useStatisticsOverviewQuery() {
  return useQuery({ queryKey: ['statisticsOverview'], queryFn: async () => medical.reportStatistics.getStatisticsOverview() })
}

export function useStatisticsTrendsQuery() {
  return useQuery({ queryKey: ['statisticsTrends'], queryFn: async () => medical.reportStatistics.getStatisticsTrends() })
}

export function useStatisticsDistributionsQuery() {
  return useQuery({ queryKey: ['statisticsDistributions'], queryFn: async () => medical.reportStatistics.getStatisticsDistributions() })
}

export function useExportStatisticsMutation() {
  return useMutation({
    mutationFn: () => medical.reportStatistics.exportStatistics(),
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'statistics.csv'
      link.click()
      URL.revokeObjectURL(url)
    },
  })
}
