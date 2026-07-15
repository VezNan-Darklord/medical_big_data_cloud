import { useMutation, useQuery } from '@tanstack/react-query'
import medical from '../instance'
import type { LoginRequest } from '../models/LoginRequest'
import type { RegisterRequest } from '../models/RegisterRequest'
import { getAccessToken } from '../instance'

export type ElderlyRegisterRequest = Omit<RegisterRequest, 'roleCode'>

export function useLoginMutation() {
  return useMutation({
    mutationFn: async (req: LoginRequest) => medical.auth.login(req),
    mutationKey: ['login'],
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (req: ElderlyRegisterRequest) =>
      medical.auth.register({ ...req, roleCode: 'elderly' }),
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
    mutationFn: async () => medical.auth.logout(),
    mutationKey: ['logout'],
  })
}
