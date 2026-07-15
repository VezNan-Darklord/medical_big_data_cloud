/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiAssessmentReport } from '../models/ApiAssessmentReport';
import type { ApiAssessmentReportPage } from '../models/ApiAssessmentReportPage';
import type { ApiEmpty } from '../models/ApiEmpty';
import type { AssessmentReportCreateRequest } from '../models/AssessmentReportCreateRequest';
import type { AssessmentReportReviewRequest } from '../models/AssessmentReportReviewRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AssessmentReportService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 评估报告列表
     * 仅管理员和医生可访问�?
     * @param elderlyId
     * @param pageNo
     * @param pageSize
     * @returns ApiAssessmentReportPage 成功
     * @throws ApiError
     */
    public listAssessmentReports(
        elderlyId?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiAssessmentReportPage> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/assessment-reports',
            query: {
                'elderlyId': elderlyId,
                'pageNo': pageNo,
                'pageSize': pageSize,
            },
            errors: {
                403: `当前角色无权访问`,
            },
        });
    }
    /**
     * 创建评估报告
     * 管理员或医生创建。评估人固定取当前登录用户，报告必须包含病症/风险评估和用药或后续动作建议�?
     * @param requestBody
     * @returns ApiAssessmentReport 成功
     * @throws ApiError
     */
    public createAssessmentReport(
        requestBody: AssessmentReportCreateRequest,
    ): CancelablePromise<ApiAssessmentReport> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/assessment-reports',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数或业务输入错�?`,
                403: `当前角色无权访问`,
                404: `数据不存�?`,
            },
        });
    }
    /**
     * 报告详情
     * 仅管理员和医生可访问�?
     * @param id
     * @returns ApiAssessmentReport 成功
     * @throws ApiError
     */
    public getAssessmentReport(
        id: string,
    ): CancelablePromise<ApiAssessmentReport> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/assessment-reports/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存�?`,
            },
        });
    }
    /**
     * 软删除报�?
     * @param id
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public deleteAssessmentReport(
        id: string,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/assessment-reports/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存�?`,
            },
        });
    }
    /**
     * 复核评估报告
     * @param id
     * @param requestBody
     * @returns ApiAssessmentReport 成功
     * @throws ApiError
     */
    public reviewAssessmentReport(
        id: string,
        requestBody: AssessmentReportReviewRequest,
    ): CancelablePromise<ApiAssessmentReport> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/assessment-reports/{id}/review',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存�?`,
            },
        });
    }
    /**
     * 导出 Markdown 报告文件
     * 仅管理员和医生可访问�?
     * @param id
     * @returns binary UTF-8 Markdown 文件
     * @throws ApiError
     */
    public exportAssessmentReport(
        id: string,
    ): CancelablePromise<Blob> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/assessment-reports/{id}/export',
            path: {
                'id': id,
            },
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存�?`,
            },
        });
    }
}
