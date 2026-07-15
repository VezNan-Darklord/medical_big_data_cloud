/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiKeyPopulation } from '../models/ApiKeyPopulation';
import type { ApiKeyPopulationPage } from '../models/ApiKeyPopulationPage';
import type { KeyPopulationCreateRequest } from '../models/KeyPopulationCreateRequest';
import type { KeyPopulationUpdateRequest } from '../models/KeyPopulationUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class KeyPopulationService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 重点人群列表
     * @param status
     * @param pageNo
     * @param pageSize
     * @returns ApiKeyPopulationPage 成功
     * @throws ApiError
     */
    public listKeyPopulations(
        status?: 'active' | 'closed',
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiKeyPopulationPage> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/key-populations',
            query: {
                'status': status,
                'pageNo': pageNo,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * 新增重点人群
     * @param requestBody
     * @returns ApiKeyPopulation 成功
     * @throws ApiError
     */
    public createKeyPopulation(
        requestBody: KeyPopulationCreateRequest,
    ): CancelablePromise<ApiKeyPopulation> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/key-populations',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数或业务输入错误`,
                403: `当前角色无权访问`,
                409: `数据冲突或仍被引用`,
            },
        });
    }
    /**
     * 重点人群详情
     * @param id
     * @returns ApiKeyPopulation 成功
     * @throws ApiError
     */
    public getKeyPopulation(
        id: string,
    ): CancelablePromise<ApiKeyPopulation> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/key-populations/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `数据不存在`,
            },
        });
    }
    /**
     * 更新重点人群
     * @param id
     * @param requestBody
     * @returns ApiKeyPopulation 成功
     * @throws ApiError
     */
    public updateKeyPopulation(
        id: string,
        requestBody: KeyPopulationUpdateRequest,
    ): CancelablePromise<ApiKeyPopulation> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/key-populations/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存在`,
            },
        });
    }
    /**
     * 软删除重点人群记�?
     * @param id
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public deleteKeyPopulation(
        id: string,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/key-populations/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存在`,
            },
        });
    }
    /**
     * 关闭重点人群记录
     * @param id
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public closeKeyPopulation(
        id: string,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/key-populations/{id}/close',
            path: {
                'id': id,
            },
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存在`,
            },
        });
    }
}
