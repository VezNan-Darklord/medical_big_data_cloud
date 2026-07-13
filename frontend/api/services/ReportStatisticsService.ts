/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiObject } from '../models/ApiObject';
import type { ApiString } from '../models/ApiString';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ReportStatisticsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 统计总览
     * @returns ApiObject 成功
     * @throws ApiError
     */
    public getStatisticsOverview(): CancelablePromise<ApiObject> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/reports/statistics/overview',
        });
    }
    /**
     * 趋势统计
     * @returns ApiObject 成功
     * @throws ApiError
     */
    public getStatisticsTrends(): CancelablePromise<ApiObject> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/reports/statistics/trends',
        });
    }
    /**
     * 分布统计
     * @returns ApiObject 成功
     * @throws ApiError
     */
    public getStatisticsDistributions(): CancelablePromise<ApiObject> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/reports/statistics/distributions',
        });
    }
    /**
     * 导出统计报表
     * @returns ApiString 成功
     * @throws ApiError
     */
    public exportStatistics(): CancelablePromise<ApiString> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/reports/statistics/export',
        });
    }
}
