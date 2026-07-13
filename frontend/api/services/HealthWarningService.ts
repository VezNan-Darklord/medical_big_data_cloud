/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiWarning } from '../models/ApiWarning';
import type { ApiWarningPage } from '../models/ApiWarningPage';
import type { HealthWarningCreateRequest } from '../models/HealthWarningCreateRequest';
import type { WarningHandleRequest } from '../models/WarningHandleRequest';
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
     * @returns ApiWarningPage 成功
     * @throws ApiError
     */
    public listHealthWarnings(
        elderlyId?: string,
        warningType?: string,
        severity?: 'low' | 'medium' | 'high' | 'critical',
        status?: string,
        source?: string,
        startTime?: string,
        endTime?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiWarningPage> {
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
     * 新增健康预警
     * @param requestBody
     * @returns ApiWarning 成功
     * @throws ApiError
     */
    public createHealthWarning(
        requestBody: HealthWarningCreateRequest,
    ): CancelablePromise<ApiWarning> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/health-warnings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `业务错误`,
            },
        });
    }
    /**
     * 预警详情
     * @param id
     * @returns ApiWarning 成功
     * @throws ApiError
     */
    public getHealthWarning(
        id: string,
    ): CancelablePromise<ApiWarning> {
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
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public handleHealthWarning(
        id: string,
        requestBody: WarningHandleRequest,
    ): CancelablePromise<ApiEmpty> {
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
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public assignHealthWarning(
        id: string,
        requestBody: string,
    ): CancelablePromise<ApiEmpty> {
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
