import { useMutation, useQuery } from '@tanstack/react-query'
import medical from '../instance'
import type { ProfileUpdateRequest } from '../models/ProfileUpdateRequest'

export function useUpdateProfileMutation() {
  return useMutation({ mutationFn: async (req: ProfileUpdateRequest) => medical.profile.updateProfile(req), mutationKey: ['updateProfile'] })
}

export function useGetMyElderlyProfileQuery() {
  return useQuery({ queryKey: ['getMyElderlyProfile'], queryFn: async () => medical.profile.getMyElderlyProfile() })
}

export function useGetTodosQuery() {
  return useQuery({ queryKey: ['getTodos'], queryFn: async () => medical.profile.getTodos() })
}
