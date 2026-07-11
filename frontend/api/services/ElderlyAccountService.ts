/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_PageResult_UserResponse } from '../models/ApiResponse_PageResult_UserResponse';
import type { ApiResponse_UserResponse } from '../models/ApiResponse_UserResponse';
import type { ApiResponse_Void } from '../models/ApiResponse_Void';
import type { UserCreateRequest } from '../models/UserCreateRequest';
import type { UserStatusUpdateRequest } from '../models/UserStatusUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ElderlyAccountService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 老人账号列表
     * @param pageNo
     * @param pageSize
     * @returns ApiResponse_PageResult_UserResponse 成功
     * @throws ApiError
     */
    public listElderlyAccounts(
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiResponse_PageResult_UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-accounts',
            query: {
                'pageNo': pageNo,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * 创建老人账号
     * @param requestBody
     * @returns ApiResponse_UserResponse 成功
     * @throws ApiError
     */
    public createElderlyAccount(
        requestBody: UserCreateRequest,
    ): CancelablePromise<ApiResponse_UserResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/elderly-accounts',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 重置老人账号密码
     * @param id
     * @param requestBody
     * @returns ApiResponse_Void 成功
     * @throws ApiError
     */
    public resetElderlyAccountPassword(
        id: string,
        requestBody: string,
    ): CancelablePromise<ApiResponse_Void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/elderly-accounts/{id}/reset-password',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 启用或禁用老人账号
     * @param id
     * @param requestBody
     * @returns ApiResponse_Void 成功
     * @throws ApiError
     */
    public updateElderlyAccountStatus(
        id: string,
        requestBody: UserStatusUpdateRequest,
    ): CancelablePromise<ApiResponse_Void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/elderly-accounts/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
