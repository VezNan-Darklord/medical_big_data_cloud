import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import medical from '../instance'
import type { LoginRequest } from '../models/LoginRequest'
import type { RegisterRequest } from '../models/RegisterRequest'
import { getAccessToken } from '../instance'

export function useLoginMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (req: LoginRequest) => medical.auth.login(req),
    mutationKey: ['login'],
    onSuccess: ()=> queryClient.invalidateQueries({ queryKey: ['getCurrentUser'] }),
  })
}

export function useRegisterMutation() {
  return useMutation({
    mutationFn: async (req: RegisterRequest) => medical.auth.register(req),
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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => medical.auth.logout(),
    mutationKey: ['logout'],
    onSuccess: ()=> queryClient.invalidateQueries({ queryKey: ['getCurrentUser'] }),
  })
}
