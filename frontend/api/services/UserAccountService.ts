/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiUser } from '../models/ApiUser';
import type { ApiUserPage } from '../models/ApiUserPage';
import type { RoleAssignRequest } from '../models/RoleAssignRequest';
import type { RoleCode } from '../models/RoleCode';
import type { UserCreateRequest } from '../models/UserCreateRequest';
import type { UserStatusUpdateRequest } from '../models/UserStatusUpdateRequest';
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
     * @returns ApiUserPage 成功
     * @throws ApiError
     */
    public listUsers(
        keyword?: string,
        roleCode?: RoleCode,
        status?: 'enabled' | 'disabled',
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiUserPage> {
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
            errors: {
                403: `当前角色无权访问`,
            },
        });
    }
    /**
     * 创建系统账户
     * @param requestBody
     * @returns ApiUser 成功
     * @throws ApiError
     */
    public createUser(
        requestBody: UserCreateRequest,
    ): CancelablePromise<ApiUser> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数或业务输入错�?`,
                403: `当前角色无权访问`,
                409: `数据冲突或仍被引�?`,
            },
        });
    }
    /**
     * 系统账户详情
     * @param id
     * @returns ApiUser 成功
     * @throws ApiError
     */
    public getUser(
        id: string,
    ): CancelablePromise<ApiUser> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存�?`,
            },
        });
    }
    /**
     * 更新系统账户
     * @param id
     * @param requestBody
     * @returns ApiUser 成功
     * @throws ApiError
     */
    public updateUser(
        id: string,
        requestBody: UserUpdateRequest,
    ): CancelablePromise<ApiUser> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/users/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存�?`,
            },
        });
    }
    /**
     * 软删除系统账�?
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
                403: `当前角色无权访问`,
                404: `数据不存�?`,
            },
        });
    }
    /**
     * 修改系统账户状�?
     * @param id
     * @param requestBody
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public updateUserStatus(
        id: string,
        requestBody: UserStatusUpdateRequest,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存�?`,
            },
        });
    }
    /**
     * 分配单一系统角色
     * @param id
     * @param requestBody
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public assignUserRole(
        id: string,
        requestBody: RoleAssignRequest,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/{id}/roles',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数或业务输入错�?`,
                403: `当前角色无权访问`,
                404: `数据不存�?`,
            },
        });
    }
}
