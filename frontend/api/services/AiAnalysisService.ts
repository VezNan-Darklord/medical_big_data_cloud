/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AnalysisRequest } from '../models/AnalysisRequest';
import type { ApiAnalysis } from '../models/ApiAnalysis';
import type { ApiAnalysisList } from '../models/ApiAnalysisList';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AiAnalysisService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 生成并持久化照护决策分析
     * 当前实现使用可复现的业务规则引擎，根据请求中的结构化指标生成结果并持久化�?
     * @param requestBody
     * @returns ApiAnalysis 成功
     * @throws ApiError
     */
    public createCareDecisionAnalysis(
        requestBody: AnalysisRequest,
    ): CancelablePromise<ApiAnalysis> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/ai/analysis/care-decision',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数或业务输入错误`,
                403: `当前角色无权访问`,
            },
        });
    }
    /**
     * 查询最�?100 条分析历�?
     * @returns ApiAnalysisList 成功
     * @throws ApiError
     */
    public listCareDecisionHistory(): CancelablePromise<ApiAnalysisList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/ai/analysis/care-decision/history',
        });
    }
    /**
     * 分析详情
     * @param id
     * @returns ApiAnalysis 成功
     * @throws ApiError
     */
    public getCareDecisionAnalysis(
        id: string,
    ): CancelablePromise<ApiAnalysis> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/ai/analysis/care-decision/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `数据不存在`,
            },
        });
    }
}
