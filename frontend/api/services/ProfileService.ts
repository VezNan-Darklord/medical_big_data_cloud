/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiObjectList } from '../models/ApiObjectList';
import type { ProfileUpdateRequest } from '../models/ProfileUpdateRequest';
import type { UserResponse } from '../models/UserResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProfileService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 统一个人资料更新
     * 用户修改自己的账户信息，涵盖：对外展示信息(realName)、个人隐私信息(mobile)、密码修改(oldPassword+newPassword)。所有字段为可选，仅传入非空字段会被更新。
     * @param requestBody
     * @returns UserResponse 成功
     * @throws ApiError
     */
    public updateProfile(
        requestBody: ProfileUpdateRequest,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/profile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `业务错误`,
            },
        });
    }
    /**
     * 我的健康档案
     * 当前登录老人查看自己的健康档案。基于JWT Token自动识别身份，仅 elderly 角色可调用。
     * @returns any
     * @throws ApiError
     */
    public getMyElderlyProfile(): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/profile/elderly',
            errors: {
                401: `业务错误`,
                403: `业务错误`,
                404: `业务错误`,
            },
        });
    }
    /**
     * 我的待办
     * @returns ApiObjectList 成功
     * @throws ApiError
     */
    public getTodos(): CancelablePromise<ApiObjectList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/profile/todos',
        });
    }
}
