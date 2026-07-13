/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnalysisRequest } from '../models/AnalysisRequest';
import type { ApiAnalysisResult } from '../models/ApiAnalysisResult';
import type { ApiObjectList } from '../models/ApiObjectList';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AiAnalysisService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 生成照护决策分析
     * 仅限 admin 和 doctor 角色调用
     * @param requestBody
     * @returns ApiAnalysisResult 成功
     * @throws ApiError
     */
    public createCareDecisionAnalysis(
        requestBody: AnalysisRequest,
    ): CancelablePromise<ApiAnalysisResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/ai/analysis/care-decision',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 分析历史
     * @returns ApiObjectList 成功
     * @throws ApiError
     */
    public listCareDecisionHistory(): CancelablePromise<ApiObjectList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/ai/analysis/care-decision/history',
        });
    }
    /**
     * 分析详情
     * @param id
     * @returns ApiAnalysisResult 成功
     * @throws ApiError
     */
    public getCareDecisionAnalysis(
        id: string,
    ): CancelablePromise<ApiAnalysisResult> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/ai/analysis/care-decision/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `业务错误`,
            },
        });
    }
}
