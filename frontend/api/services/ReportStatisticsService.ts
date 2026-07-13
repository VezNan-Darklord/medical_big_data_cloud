/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_DashboardOverviewResponse } from '../models/ApiResponse_DashboardOverviewResponse';
import type { ApiResponse_String } from '../models/ApiResponse_String';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ReportStatisticsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 统计总览
     * @returns ApiResponse_DashboardOverviewResponse 成功
     * @throws ApiError
     */
    public getStatisticsOverview(): CancelablePromise<ApiResponse_DashboardOverviewResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/reports/statistics/overview',
        });
    }
    /**
     * 趋势数据
     * @returns ApiResponse_String 成功
     * @throws ApiError
     */
    public getStatisticsTrends(): CancelablePromise<ApiResponse_String> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/reports/statistics/trends',
        });
    }
    /**
     * 分布数据
     * @returns ApiResponse_String 成功
     * @throws ApiError
     */
    public getStatisticsDistributions(): CancelablePromise<ApiResponse_String> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/reports/statistics/distributions',
        });
    }
    /**
     * 导出统计报表
     * @returns ApiResponse_String 成功
     * @throws ApiError
     */
    public exportStatistics(): CancelablePromise<ApiResponse_String> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/reports/statistics/export',
        });
    }
}
