/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiChartList } from '../models/ApiChartList';
import type { ApiStatisticsOverview } from '../models/ApiStatisticsOverview';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ReportStatisticsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 报表统计总览
     * 仅管理员可访问，返回顶部统计卡片所需的业务指标�?
     * @returns ApiStatisticsOverview 成功
     * @throws ApiError
     */
    public getStatisticsOverview(): CancelablePromise<ApiStatisticsOverview> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/reports/statistics/overview',
            errors: {
                403: `当前角色无权访问`,
            },
        });
    }
    /**
     * 趋势统计图表
     * 仅管理员可访问。固定返回重点人群变化趋势、老人档案变化趋势和设备关联统计�?
     * @returns ApiChartList 成功
     * @throws ApiError
     */
    public getStatisticsTrends(): CancelablePromise<ApiChartList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/reports/statistics/trends',
            errors: {
                403: `当前角色无权访问`,
            },
        });
    }
    /**
     * 分布统计图表
     * 仅管理员可访问�?
     * @returns ApiChartList 成功
     * @throws ApiError
     */
    public getStatisticsDistributions(): CancelablePromise<ApiChartList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/reports/statistics/distributions',
            errors: {
                403: `当前角色无权访问`,
            },
        });
    }
    /**
     * 导出统计 CSV
     * 仅管理员可访问�?
     * @returns binary UTF-8 CSV 文件
     * @throws ApiError
     */
    public exportStatistics(): CancelablePromise<Blob> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/reports/statistics/export',
            errors: {
                403: `当前角色无权访问`,
            },
        });
    }
}
