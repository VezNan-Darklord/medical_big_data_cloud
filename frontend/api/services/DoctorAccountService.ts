/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiUser } from '../models/ApiUser';
import type { ApiUserPage } from '../models/ApiUserPage';
import type { PasswordRequest } from '../models/PasswordRequest';
import type { SpecializedUserCreateRequest } from '../models/SpecializedUserCreateRequest';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DoctorAccountService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 医生账户列表
     * @param status
     * @param pageNo
     * @param pageSize
     * @returns ApiUserPage 成功
     * @throws ApiError
     */
    public listDoctorAccounts(
        status?: 'enabled' | 'disabled',
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiUserPage> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/doctor-accounts',
            query: {
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
     * 创建医生账户
     * @param requestBody
     * @returns ApiUser 成功
     * @throws ApiError
     */
    public createDoctorAccount(
        requestBody: SpecializedUserCreateRequest,
    ): CancelablePromise<ApiUser> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/doctor-accounts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `当前角色无权访问`,
                409: `数据冲突或仍被引�?`,
            },
        });
    }
    /**
     * 更新医生账户
     * @param id
     * @param requestBody
     * @returns ApiUser 成功
     * @throws ApiError
     */
    public updateDoctorAccount(
        id: string,
        requestBody: UserUpdateRequest,
    ): CancelablePromise<ApiUser> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/doctor-accounts/{id}',
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
     * 重置医生账户密码
     * @param id
     * @param requestBody
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public resetDoctorPassword(
        id: string,
        requestBody: PasswordRequest,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/doctor-accounts/{id}/reset-password',
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
}
