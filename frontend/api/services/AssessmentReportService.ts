/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_AssessmentReportResponse } from '../models/ApiResponse_AssessmentReportResponse';
import type { ApiResponse_PageResult_AssessmentReportResponse } from '../models/ApiResponse_PageResult_AssessmentReportResponse';
import type { ApiResponse_String } from '../models/ApiResponse_String';
import type { AssessmentReportCreateRequest } from '../models/AssessmentReportCreateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AssessmentReportService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 评估报告列表
     * @param elderlyId
     * @param pageNo
     * @param pageSize
     * @returns ApiResponse_PageResult_AssessmentReportResponse 成功
     * @throws ApiError
     */
    public listAssessmentReports(
        elderlyId?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiResponse_PageResult_AssessmentReportResponse> {
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
     * 新增评估报告
     * @param requestBody
     * @returns ApiResponse_AssessmentReportResponse 成功
     * @throws ApiError
     */
    public createAssessmentReport(
        requestBody: AssessmentReportCreateRequest,
    ): CancelablePromise<ApiResponse_AssessmentReportResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/assessment-reports',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 评估报告详情
     * @param id
     * @returns ApiResponse_AssessmentReportResponse 成功
     * @throws ApiError
     */
    public getAssessmentReportById(
        id: string,
    ): CancelablePromise<ApiResponse_AssessmentReportResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/assessment-reports/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 导出评估报告
     * @param id
     * @returns ApiResponse_String 成功
     * @throws ApiError
     */
    public exportAssessmentReport(
        id: string,
    ): CancelablePromise<ApiResponse_String> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/assessment-reports/{id}/export',
            path: {
                'id': id,
            },
        });
    }
}
