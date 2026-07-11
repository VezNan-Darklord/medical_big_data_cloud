/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiLogin } from '../models/ApiLogin';
import type { ApiUser } from '../models/ApiUser';
import type { LoginRequest } from '../models/LoginRequest';
import type { RegisterRequest } from '../models/RegisterRequest';
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
     * 老人用户公开注册
     * @param requestBody
     * @returns ApiUser 成功
     * @throws ApiError
     */
    public register(
        requestBody: RegisterRequest,
    ): CancelablePromise<ApiUser> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `业务错误`,
            },
        });
    }
    /**
     * 当前用户
     * @returns ApiUser 成功
     * @throws ApiError
     */
    public getCurrentUser(): CancelablePromise<ApiUser> {
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
