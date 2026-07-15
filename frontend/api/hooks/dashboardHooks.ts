import { useQuery } from '@tanstack/react-query'
import medical from '../instance'

export function useDashboardOverviewQuery() {
  return useQuery({ queryKey: ['dashboardOverview'], queryFn: async () => medical.dashboard.getDashboardOverview() })
}

export function useDashboardChartsQuery() {
  return useQuery({ queryKey: ['dashboardCharts'], queryFn: async () => medical.dashboard.getDashboardCharts() })
}
