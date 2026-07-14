/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiLogin } from '../models/ApiLogin';
import type { LoginRequest } from '../models/LoginRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AuthService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 登录
     * @param requestBody
     * @returns ApiLogin 成功
     * @throws ApiError
     */
    public login(
        requestBody: LoginRequest,
    ): CancelablePromise<ApiLogin> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `业务错误`,
                401: `业务错误`,
            },
        });
    }
    /**
     * 统一用户注册
     * 未登录用户只能注册 elderly 角色；已登录管理员可注册 doctor 角色；管理员只能在 APIFox 中注册；返回 JWT token
     * @param requestBody
     * @returns ApiLogin 成功
     * @throws ApiError
     */
    public register(
        requestBody: RegisterRequest,
    ): CancelablePromise<ApiLogin> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `业务错误`,
                403: `业务错误`,
            },
        });
    }
    /**
     * 当前用户
     * @returns UserResponse 成功
     * @throws ApiError
     */
    public getCurrentUser(): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/me',
            errors: {
                401: `业务错误`,
            },
        });
    }
    /**
     * 退出登录
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public logout(): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/logout',
        });
    }
}
