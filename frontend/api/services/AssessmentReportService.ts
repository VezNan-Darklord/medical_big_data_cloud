/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiObject } from '../models/ApiObject';
import type { ApiObjectPage } from '../models/ApiObjectPage';
import type { ApiString } from '../models/ApiString';
import type { AssessmentReportInput } from '../models/AssessmentReportInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AssessmentReportService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 报告列表
     * @param elderlyId
     * @param pageNo
     * @param pageSize
     * @returns ApiObjectPage 成功
     * @throws ApiError
     */
    public listAssessmentReports(
        elderlyId?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiObjectPage> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/assessment-reports',
            query: {
                'elderlyId': elderlyId,
                'pageNo': pageNo,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * 生成评估报告
     * @param requestBody
     * @returns ApiObject 成功
     * @throws ApiError
     */
    public createAssessmentReport(
        requestBody: AssessmentReportInput,
    ): CancelablePromise<ApiObject> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/assessment-reports',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 报告详情
     * @param id
     * @returns ApiObject 成功
     * @throws ApiError
     */
    public getAssessmentReport(
        id: string,
    ): CancelablePromise<ApiObject> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/assessment-reports/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 删除报告
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
                404: `业务错误`,
            },
        });
    }
    /**
     * 导出报告
     * @param id
     * @returns ApiString 成功
     * @throws ApiError
     */
    public exportAssessmentReport(
        id: string,
    ): CancelablePromise<ApiString> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/assessment-reports/{id}/export',
            path: {
                'id': id,
            },
        });
    }
}
