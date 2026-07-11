/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_PageResult_UserResponse } from '../models/ApiResponse_PageResult_UserResponse';
import type { ApiResponse_UserResponse } from '../models/ApiResponse_UserResponse';
import type { ApiResponse_Void } from '../models/ApiResponse_Void';
import type { UserCreateRequest } from '../models/UserCreateRequest';
import type { UserStatusUpdateRequest } from '../models/UserStatusUpdateRequest';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UserAccountService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 系统账号列表
     * @param keyword
     * @param pageNo
     * @param pageSize
     * @returns ApiResponse_PageResult_UserResponse 成功
     * @throws ApiError
     */
    public listUsers(
        keyword?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiResponse_PageResult_UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users',
            query: {
                'keyword': keyword,
                'pageNo': pageNo,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * 创建系统账号
     * @param requestBody
     * @returns ApiResponse_UserResponse 成功
     * @throws ApiError
     */
    public createUser(
        requestBody: UserCreateRequest,
    ): CancelablePromise<ApiResponse_UserResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 账号详情
     * @param id
     * @returns ApiResponse_UserResponse 成功
     * @throws ApiError
     */
    public getUserById(
        id: string,
    ): CancelablePromise<ApiResponse_UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 修改账号
     * @param id
     * @param requestBody
     * @returns ApiResponse_UserResponse 成功
     * @throws ApiError
     */
    public updateUser(
        id: string,
        requestBody: UserUpdateRequest,
    ): CancelablePromise<ApiResponse_UserResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 修改账号状态
     * @param id
     * @param requestBody
     * @returns ApiResponse_Void 成功
     * @throws ApiError
     */
    public updateUserStatus(
        id: string,
        requestBody: UserStatusUpdateRequest,
    ): CancelablePromise<ApiResponse_Void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 分配角色
     * @param id
     * @param requestBody
     * @returns ApiResponse_Void 成功
     * @throws ApiError
     */
    public assignRoles(
        id: string,
        requestBody: string,
    ): CancelablePromise<ApiResponse_Void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/{id}/roles',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
