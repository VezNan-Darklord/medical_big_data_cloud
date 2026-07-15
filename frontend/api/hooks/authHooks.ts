import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { LoginRequest } from '../models/LoginRequest'
import type { RegisterRequest } from '../models/RegisterRequest'
import { getAccessToken, getRefreshToken } from '../instance'

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
  return useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken()
      return medical.auth.logout(refreshToken ? { refreshToken } : undefined)
    },
    mutationKey: ['logout'],
  })
}
