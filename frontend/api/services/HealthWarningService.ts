/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiWarning } from '../models/ApiWarning';
import type { ApiWarningPage } from '../models/ApiWarningPage';
import type { HealthWarningAssignRequest } from '../models/HealthWarningAssignRequest';
import type { HealthWarningCreateRequest } from '../models/HealthWarningCreateRequest';
import type { HealthWarningHandleRequest } from '../models/HealthWarningHandleRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class HealthWarningService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 健康预警列表
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
        status?: 'unprocessed' | 'processing' | 'processed' | 'closed',
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
            errors: {
                400: `参数或业务输入错误`,
            },
        });
    }
    /**
     * 新增健康预警
     * 管理员、医生和运营人员创建时 elderlyId 必须是老人账户用户 ID；老人本人创建时可不传 elderlyId，服务端会自动绑定当前账号的用户 ID。
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
                400: `参数或业务输入错误`,
                403: `当前角色无权访问`,
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
            errors: {
                404: `数据不存在`,
            },
        });
    }
    /**
     * 软删除预警
     * @param id
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public deleteHealthWarning(
        id: string,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/health-warnings/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存在`,
            },
        });
    }
    /**
     * 处理或关闭预警
     * @param id
     * @param requestBody
     * @returns ApiWarning 成功
     * @throws ApiError
     */
    public handleHealthWarning(
        id: string,
        requestBody: HealthWarningHandleRequest,
    ): CancelablePromise<ApiWarning> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/health-warnings/{id}/handle',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数或业务输入错误`,
                403: `当前角色无权访问`,
                404: `数据不存在`,
                409: `数据冲突或仍被引用`,
            },
        });
    }
    /**
     * 转派预警给医生
     * @param id
     * @param requestBody
     * @returns ApiWarning 成功
     * @throws ApiError
     */
    public assignHealthWarning(
        id: string,
        requestBody: HealthWarningAssignRequest,
    ): CancelablePromise<ApiWarning> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/health-warnings/{id}/assign',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数或业务输入错误`,
                403: `当前角色无权访问`,
                404: `数据不存在`,
            },
        });
    }
}
