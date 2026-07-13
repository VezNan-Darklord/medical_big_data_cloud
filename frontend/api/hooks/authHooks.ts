import { useMutation, useQuery } from '@tanstack/react-query'
import  medical  from '../instance'
import { LoginRequest } from '../models/LoginRequest'
import { RegisterRequest } from '../models/RegisterRequest'

export function useLoginMutation() {
    return useMutation({
        mutationFn: async (req: LoginRequest) => medical.auth.login(req),
        mutationKey: ['login'],
    })
};

export function useRegisterMutation() {
    return useMutation({
        mutationFn: async(req: RegisterRequest)=> medical.auth.register(req),
        mutationKey: ['register']
    })
}

export function useGetCurrentUserQuery() { 
    return useQuery({
        queryKey: ['getCurrentUser'],
        queryFn: async () => medical.auth.getCurrentUser(),
    })
 }

export function useLogoutMutation() {
    return useMutation({
        mutationFn: async () => medical.auth.logout(),
        mutationKey: ['logout'],
    })
}