/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiObjectPage } from '../models/ApiObjectPage';
import type { StatusRequest } from '../models/StatusRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ElderlyAccountService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 老人账户列表
     * @param pageNo
     * @param pageSize
     * @returns ApiObjectPage 成功
     * @throws ApiError
     */
    public listElderlyAccounts(
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiObjectPage> {
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
     * 重置老人密码
     * @param id
     * @param requestBody
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public resetElderlyPassword(
        id: string,
        requestBody: string,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/elderly-accounts/{id}/reset-password',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'text/plain',
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
        requestBody: StatusRequest,
    ): CancelablePromise<ApiEmpty> {
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
