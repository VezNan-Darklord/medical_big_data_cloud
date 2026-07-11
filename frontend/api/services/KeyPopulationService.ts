/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_KeyPopulationResponse } from '../models/ApiResponse_KeyPopulationResponse';
import type { ApiResponse_PageResult_KeyPopulationResponse } from '../models/ApiResponse_PageResult_KeyPopulationResponse';
import type { ApiResponse_Void } from '../models/ApiResponse_Void';
import type { KeyPopulationCreateRequest } from '../models/KeyPopulationCreateRequest';
import type { KeyPopulationUpdateRequest } from '../models/KeyPopulationUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class KeyPopulationService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 重点人群列表
     * @param status
     * @param pageNo
     * @param pageSize
     * @returns ApiResponse_PageResult_KeyPopulationResponse 成功
     * @throws ApiError
     */
    public listKeyPopulations(
        status?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiResponse_PageResult_KeyPopulationResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/key-populations',
            query: {
                'status': status,
                'pageNo': pageNo,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * 新增重点人群
     * @param requestBody
     * @returns ApiResponse_KeyPopulationResponse 成功
     * @throws ApiError
     */
    public createKeyPopulation(
        requestBody: KeyPopulationCreateRequest,
    ): CancelablePromise<ApiResponse_KeyPopulationResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/key-populations',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 更新重点人群
     * @param id
     * @param requestBody
     * @returns ApiResponse_KeyPopulationResponse 成功
     * @throws ApiError
     */
    public updateKeyPopulation(
        id: string,
        requestBody: KeyPopulationUpdateRequest,
    ): CancelablePromise<ApiResponse_KeyPopulationResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/key-populations/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 关闭重点人群
     * @param id
     * @returns ApiResponse_Void 成功
     * @throws ApiError
     */
    public closeKeyPopulation(
        id: string,
    ): CancelablePromise<ApiResponse_Void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/key-populations/{id}/close',
            path: {
                'id': id,
            },
        });
    }
}
