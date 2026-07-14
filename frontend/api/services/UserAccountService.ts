/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiObjectPage } from '../models/ApiObjectPage';
import type { UserResponse } from '../models/UserResponse';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class UserAccountService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 系统账户列表
     * @param keyword
     * @param roleCode
     * @param status
     * @param pageNo
     * @param pageSize
     * @returns ApiObjectPage 成功
     * @throws ApiError
     */
    public listUsers(
        keyword?: string,
        roleCode?: string,
        status?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiObjectPage> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users',
            query: {
                'keyword': keyword,
                'roleCode': roleCode,
                'status': status,
                'pageNo': pageNo,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * 系统账户详情
     * @param id
     * @returns UserResponse 成功
     * @throws ApiError
     */
    public getUser(
        id: string,
    ): CancelablePromise<UserResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 更新系统账户
     * @param id
     * @param requestBody
     * @returns UserResponse 成功
     * @throws ApiError
     */
    public updateUser(
        id: string,
        requestBody: UserUpdateRequest,
    ): CancelablePromise<UserResponse> {
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
     * 删除账户
     * @param id
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public deleteUser(
        id: string,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `业务错误`,
            },
        });
    }
    /**
     * 分配角色
     * @param id
     * @param requestBody
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public assignUserRole(
        id: string,
        requestBody: string,
    ): CancelablePromise<ApiEmpty> {
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
