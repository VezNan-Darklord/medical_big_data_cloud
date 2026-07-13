/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_LoginResponse } from '../models/ApiResponse_LoginResponse';
import type { ApiResponse_LoginUserInfo } from '../models/ApiResponse_LoginUserInfo';
import type { ApiResponse_UserResponse } from '../models/ApiResponse_UserResponse';
import type { ApiResponse_Void } from '../models/ApiResponse_Void';
import type { LoginRequest } from '../models/LoginRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 用户登录
     * @param requestBody
     * @returns ApiResponse_LoginResponse 成功
     * @throws ApiError
     */
    public login(
        requestBody: LoginRequest,
    ): CancelablePromise<ApiResponse_LoginResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 统一用户注册
     * 未登录用户只能注册 elderly 角色；已登录管理员可注册任意角色
     * @param requestBody
     * @returns ApiResponse_UserResponse 注册成功
     * @throws ApiError
     */
    public register(
        requestBody: RegisterRequest,
    ): CancelablePromise<ApiResponse_UserResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数错误、用户名或手机号已存在`,
                403: `无权限注册该角色`,
            },
        });
    }
    /**
     * 获取当前用户信息
     * @returns ApiResponse_LoginUserInfo 成功
     * @throws ApiError
     */
    public getCurrentUser(): CancelablePromise<ApiResponse_LoginUserInfo> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/me',
        });
    }
    /**
     * 退出登录
     * @returns ApiResponse_Void 成功
     * @throws ApiError
     */
    public logout(): CancelablePromise<ApiResponse_Void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/logout',
        });
    }
}
