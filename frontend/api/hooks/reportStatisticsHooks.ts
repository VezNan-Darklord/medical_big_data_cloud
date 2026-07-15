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
    mutationFn: async () => medical.reportStatistics.exportStatistics(),
    mutationKey: ['exportStatistics'],
  })
}
