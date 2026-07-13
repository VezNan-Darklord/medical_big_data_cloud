/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiElderly } from '../models/ApiElderly';
import type { ApiElderlyPage } from '../models/ApiElderlyPage';
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiObjectList } from '../models/ApiObjectList';
import type { ElderlyProfileInput } from '../models/ElderlyProfileInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ElderlyProfileService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 老人档案列表
     * @param keyword
     * @param gender
     * @param careLevel
     * @param status
     * @param regionCode
     * @param pageNo
     * @param pageSize
     * @returns ApiElderlyPage 成功
     * @throws ApiError
     */
    public listElderlyProfiles(
        keyword?: string,
        gender?: 'male' | 'female',
        careLevel?: string,
        status?: string,
        regionCode?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiElderlyPage> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles',
            query: {
                'keyword': keyword,
                'gender': gender,
                'careLevel': careLevel,
                'status': status,
                'regionCode': regionCode,
                'pageNo': pageNo,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * 新增老人档案
     * 仅限 admin 和 doctor 角色调用
     * @param requestBody
     * @returns ApiElderly 成功
     * @throws ApiError
     */
    public createElderlyProfile(
        requestBody: ElderlyProfileInput,
    ): CancelablePromise<ApiElderly> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/elderly-profiles',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `业务错误`,
            },
        });
    }
    /**
     * 老人档案详情
     * @param id
     * @returns ApiElderly 成功
     * @throws ApiError
     */
    public getElderlyProfile(
        id: string,
    ): CancelablePromise<ApiElderly> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `业务错误`,
            },
        });
    }
    /**
     * 更新老人档案
     * @param id
     * @param requestBody
     * @returns ApiElderly 成功
     * @throws ApiError
     */
    public updateElderlyProfile(
        id: string,
        requestBody: ElderlyProfileInput,
    ): CancelablePromise<ApiElderly> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/elderly-profiles/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 软删除老人档案
     * @param id
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public deleteElderlyProfile(
        id: string,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/elderly-profiles/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 老人关联预警
     * @param id
     * @returns ApiObjectList 成功
     * @throws ApiError
     */
    public getElderlyWarnings(
        id: string,
    ): CancelablePromise<ApiObjectList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}/warnings',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 老人关联报告
     * @param id
     * @returns ApiObjectList 成功
     * @throws ApiError
     */
    public getElderlyReports(
        id: string,
    ): CancelablePromise<ApiObjectList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}/reports',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 老人关联设备
     * @param id
     * @returns ApiObjectList 成功
     * @throws ApiError
     */
    public getElderlyDevices(
        id: string,
    ): CancelablePromise<ApiObjectList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}/devices',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 老人关联重点人群
     * @param id
     * @returns ApiObjectList 成功
     * @throws ApiError
     */
    public getElderlyKeyPopulations(
        id: string,
    ): CancelablePromise<ApiObjectList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}/key-populations',
            path: {
                'id': id,
            },
        });
    }
}
