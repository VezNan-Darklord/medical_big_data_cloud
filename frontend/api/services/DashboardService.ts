/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiChartList } from '../models/ApiChartList';
import type { ApiDashboardOverview } from '../models/ApiDashboardOverview';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DashboardService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 首页总览
     * @returns ApiDashboardOverview 成功
     * @throws ApiError
     */
    public getDashboardOverview(): CancelablePromise<ApiDashboardOverview> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/dashboard/overview',
        });
    }
    /**
     * 首页图表
     * @returns ApiChartList 成功
     * @throws ApiError
     */
    public getDashboardCharts(): CancelablePromise<ApiChartList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/dashboard/charts',
        });
    }
}
