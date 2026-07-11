/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiObjectPage } from '../models/ApiObjectPage';
import type { ApiUser } from '../models/ApiUser';
import type { UserCreateRequest } from '../models/UserCreateRequest';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DoctorAccountService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 医生账户列表
     * @param pageNo
     * @param pageSize
     * @returns ApiObjectPage 成功
     * @throws ApiError
     */
    public listDoctorAccounts(
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiObjectPage> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/doctor-accounts',
            query: {
                'pageNo': pageNo,
                'pageSize': pageSize,
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
        requestBody: UserCreateRequest,
    ): CancelablePromise<ApiUser> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/doctor-accounts',
            body: requestBody,
            mediaType: 'application/json',
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
        });
    }
    /**
     * 重置医生密码
     * @param id
     * @param requestBody
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public resetDoctorPassword(
        id: string,
        requestBody: string,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/doctor-accounts/{id}/reset-password',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'text/plain',
        });
    }
}
