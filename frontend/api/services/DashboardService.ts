/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_ArrayDashboardChartResponse } from '../models/ApiResponse_ArrayDashboardChartResponse';
import type { ApiResponse_DashboardOverviewResponse } from '../models/ApiResponse_DashboardOverviewResponse';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DashboardService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 获取首页总览
     * @returns ApiResponse_DashboardOverviewResponse 成功
     * @throws ApiError
     */
    public getOverview(): CancelablePromise<ApiResponse_DashboardOverviewResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/dashboard/overview',
        });
    }
    /**
     * 获取首页图表数据
     * @returns ApiResponse_ArrayDashboardChartResponse 成功
     * @throws ApiError
     */
    public getCharts(): CancelablePromise<ApiResponse_ArrayDashboardChartResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/dashboard/charts',
        });
    }
}
