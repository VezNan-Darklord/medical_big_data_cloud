/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_HealthWarningResponse } from '../models/ApiResponse_HealthWarningResponse';
import type { ApiResponse_PageResult_HealthWarningResponse } from '../models/ApiResponse_PageResult_HealthWarningResponse';
import type { ApiResponse_Void } from '../models/ApiResponse_Void';
import type { HealthWarningHandleRequest } from '../models/HealthWarningHandleRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class HealthWarningService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 预警列表
     * @param elderlyId
     * @param warningType
     * @param severity
     * @param status
     * @param source
     * @param startTime
     * @param endTime
     * @param pageNo
     * @param pageSize
     * @returns ApiResponse_PageResult_HealthWarningResponse 成功
     * @throws ApiError
     */
    public listHealthWarnings(
        elderlyId?: string,
        warningType?: string,
        severity?: string,
        status?: string,
        source?: string,
        startTime?: string,
        endTime?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiResponse_PageResult_HealthWarningResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/health-warnings',
            query: {
                'elderlyId': elderlyId,
                'warningType': warningType,
                'severity': severity,
                'status': status,
                'source': source,
                'startTime': startTime,
                'endTime': endTime,
                'pageNo': pageNo,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * 预警详情
     * @param id
     * @returns ApiResponse_HealthWarningResponse 成功
     * @throws ApiError
     */
    public getHealthWarningById(
        id: string,
    ): CancelablePromise<ApiResponse_HealthWarningResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/health-warnings/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 处理预警
     * @param id
     * @param requestBody
     * @returns ApiResponse_Void 成功
     * @throws ApiError
     */
    public handleHealthWarning(
        id: string,
        requestBody: HealthWarningHandleRequest,
    ): CancelablePromise<ApiResponse_Void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/health-warnings/{id}/handle',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 转派预警
     * @param id
     * @param requestBody
     * @returns ApiResponse_Void 成功
     * @throws ApiError
     */
    public assignHealthWarning(
        id: string,
        requestBody: string,
    ): CancelablePromise<ApiResponse_Void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/health-warnings/{id}/assign',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
