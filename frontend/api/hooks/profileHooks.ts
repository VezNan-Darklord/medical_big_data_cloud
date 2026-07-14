import { useMutation, useQuery } from '@tanstack/react-query'
import medical from '../instance'
import type { PasswordChangeRequest } from '../models/PasswordChangeRequest'

export function useChangePasswordMutation() {
  return useMutation({
    mutationFn: async (req: PasswordChangeRequest) => medical.profile.changePassword(req),
    mutationKey: ['changePassword'],
  })
}

export function useGetTodosQuery() {
  return useQuery({
    queryKey: ['getTodos'],
    queryFn: async () => medical.profile.getTodos(),
  })
}
