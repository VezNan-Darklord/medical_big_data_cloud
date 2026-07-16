/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiUser } from '../models/ApiUser';
import type { ApiUserPage } from '../models/ApiUserPage';
import type { PasswordRequest } from '../models/PasswordRequest';
import type { SpecializedUserCreateRequest } from '../models/SpecializedUserCreateRequest';
import type { UserStatusUpdateRequest } from '../models/UserStatusUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ElderlyAccountService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 老人账户列表
     * 管理员、医生和运营人员可查询老人账户列表。
     * @param status
     * @param pageNo
     * @param pageSize
     * @returns ApiUserPage 成功
     * @throws ApiError
     */
    public listElderlyAccounts(
        status?: 'enabled' | 'disabled',
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiUserPage> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-accounts',
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
     * 创建老人账户
     * @param requestBody
     * @returns ApiUser 成功
     * @throws ApiError
     */
    public createElderlyAccount(
        requestBody: SpecializedUserCreateRequest,
    ): CancelablePromise<ApiUser> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/elderly-accounts',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `当前角色无权访问`,
                409: `数据冲突或仍被引用`,
            },
        });
    }
    /**
     * 重置老人账户密码
     * @param id
     * @param requestBody
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public resetElderlyPassword(
        id: string,
        requestBody: PasswordRequest,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/elderly-accounts/{id}/reset-password',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存在`,
            },
        });
    }
    /**
     * 修改老人账户状态
     * @param id
     * @param requestBody
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public updateElderlyAccountStatus(
        id: string,
        requestBody: UserStatusUpdateRequest,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/elderly-accounts/{id}/status',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存在`,
            },
        });
    }
}
