import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import medical from "../instance";
import type { AnalysisRequest } from "../models/AnalysisRequest";

export function useListCareDecisionHistoryQuery() {
    return useQuery({
        queryKey: ['listCareDecisionHistory'],
        queryFn: async ()=> medical.aiAnalysis.listCareDecisionHistory()
    })
}

export function useGetCareDecisionAnalysisQuery(id: string) {
    return useQuery({
        queryKey: ['getCareDecisionAnalysis', id],
        queryFn: async () => medical.aiAnalysis.getCareDecisionAnalysis(id),
        enabled: !!id
    })
}

export function useCreateCareDecisionAnalysisMutation() {
    const qc = useQueryClient()
    return useMutation({
        mutationKey: ['createCareDecisionAnalysis'],
        mutationFn: async (requestBody: AnalysisRequest) => medical.aiAnalysis.createCareDecisionAnalysis(requestBody),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ['listCareDecisionHistory'] })
        }
    })
}

export function useDeleteCareDecisionAnalysisMutation() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (id: string) => medical.aiAnalysis.deleteCareDecisionAnalysis(id),
        onSuccess: () => { qc.invalidateQueries({ queryKey: ['listCareDecisionHistory'] }) },
        mutationKey: ['deleteCareDecisionAnalysis'],
    })
}