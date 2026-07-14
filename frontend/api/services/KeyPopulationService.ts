/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiObject } from '../models/ApiObject';
import type { ApiObjectPage } from '../models/ApiObjectPage';
import type { KeyPopulationInput } from '../models/KeyPopulationInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class KeyPopulationService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 重点人群列表
     * @param status
     * @param pageNo
     * @param pageSize
     * @returns ApiObjectPage 成功
     * @throws ApiError
     */
    public listKeyPopulations(
        status?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiObjectPage> {
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
     * @returns ApiObject 成功
     * @throws ApiError
     */
    public createKeyPopulation(
        requestBody: KeyPopulationInput,
    ): CancelablePromise<ApiObject> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/key-populations',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 更新重点人群
     * @param id
     * @param requestBody
     * @returns ApiObject 成功
     * @throws ApiError
     */
    public updateKeyPopulation(
        id: string,
        requestBody: KeyPopulationInput,
    ): CancelablePromise<ApiObject> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/key-populations/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 删除重点人群
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
                404: `业务错误`,
            },
        });
    }
    /**
     * 关闭重点人群
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
        });
    }
}
