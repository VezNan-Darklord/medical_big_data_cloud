import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { LoginRequest } from '../models/LoginRequest'
import type { RegisterRequest } from '../models/RegisterRequest'
import { getAccessToken } from '../instance'

export function useLoginMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (req: LoginRequest) => medical.auth.login(req),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['getCurrentUser'] }) },
    mutationKey: ['login'],
  })
}

export function useRegisterMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (req: RegisterRequest) => medical.auth.register(req),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['getCurrentUser'] }) },
    mutationKey: ['register'],
  })
}

export function useGetCurrentUserQuery() {
  return useQuery({
    queryKey: ['getCurrentUser'],
    queryFn: async () => medical.auth.getCurrentUser(),
    enabled: !!getAccessToken(),
  })
}

export function useLogoutMutation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async () => medical.auth.logout(),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['getCurrentUser'] }) },
    mutationKey: ['logout'],
  })
}
