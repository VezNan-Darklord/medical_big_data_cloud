/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiLogin } from '../models/ApiLogin';
import type { ApiUser } from '../models/ApiUser';
import type { LoginRequest } from '../models/LoginRequest';
import type { LogoutRequest } from '../models/LogoutRequest';
import type { RefreshTokenRequest } from '../models/RefreshTokenRequest';
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
                400: `参数或业务输入错误`,
                401: `未登录、令牌无效或账号已禁用`,
            },
        });
    }
    /**
     * 注册账号并直接登录
     * 浏览器前端仅允许注册 elderly；仅当服务端开启 Apifox 特权注册开关且 User-Agent 包含 Apifox 时，才可注册 admin、doctor 或 elderly。成功后直接返回 access token 与可轮换 refresh token。该开关默认关闭，仅用于本地开发。
     * @param requestBody
     * @param userAgent 浏览器使用默认 User-Agent；Apifox 创建管理员或医生时必须包含 Apifox，且服务端已开启特权注册开关。
     * @returns ApiLogin 成功
     * @throws ApiError
     */
    public register(
        requestBody: RegisterRequest,
        userAgent?: string,
    ): CancelablePromise<ApiLogin> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/register',
            headers: {
                'User-Agent': userAgent,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数或业务输入错误`,
                403: `当前角色无权访问`,
                409: `数据冲突或仍被引用`,
            },
        });
    }
    /**
     * 刷新并轮换令牌
     * @param requestBody
     * @returns ApiLogin 成功
     * @throws ApiError
     */
    public refreshToken(
        requestBody: RefreshTokenRequest,
    ): CancelablePromise<ApiLogin> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数或业务输入错误`,
                401: `未登录、令牌无效或账号已禁用`,
            },
        });
    }
    /**
     * 获取当前用户
     * @returns ApiUser 成功
     * @throws ApiError
     */
    public getCurrentUser(): CancelablePromise<ApiUser> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/auth/me',
            errors: {
                401: `未登录、令牌无效或账号已禁用`,
            },
        });
    }
    /**
     * 退出登录并使当前 access token 失效
     * @param requestBody
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public logout(
        requestBody?: LogoutRequest,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/auth/logout',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `未登录、令牌无效或账号已禁用`,
            },
        });
    }
}
