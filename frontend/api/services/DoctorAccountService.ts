/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_PageResult_UserResponse } from '../models/ApiResponse_PageResult_UserResponse';
import type { ApiResponse_UserResponse } from '../models/ApiResponse_UserResponse';
import type { ApiResponse_Void } from '../models/ApiResponse_Void';
import type { UserUpdateRequest } from '../models/UserUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DoctorAccountService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 医生账号列表
     * @param pageNo
     * @param pageSize
     * @returns ApiResponse_PageResult_UserResponse 成功
     * @throws ApiError
     */
    public listDoctorAccounts(
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiResponse_PageResult_UserResponse> {
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
     * 编辑医生账号
     * @param id
     * @param requestBody
     * @returns ApiResponse_UserResponse 成功
     * @throws ApiError
     */
    public updateDoctorAccount(
        id: string,
        requestBody: UserUpdateRequest,
    ): CancelablePromise<ApiResponse_UserResponse> {
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
     * 重置医生账号密码
     * @param id
     * @param requestBody
     * @returns ApiResponse_Void 成功
     * @throws ApiError
     */
    public resetDoctorAccountPassword(
        id: string,
        requestBody: string,
    ): CancelablePromise<ApiResponse_Void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/doctor-accounts/{id}/reset-password',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
