/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiAssessmentReportList } from '../models/ApiAssessmentReportList';
import type { ApiDeviceList } from '../models/ApiDeviceList';
import type { ApiElderly } from '../models/ApiElderly';
import type { ApiElderlyPage } from '../models/ApiElderlyPage';
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiKeyPopulationList } from '../models/ApiKeyPopulationList';
import type { ApiWarningList } from '../models/ApiWarningList';
import type { ElderlyProfileCreateRequest } from '../models/ElderlyProfileCreateRequest';
import type { ElderlyProfileUpdateRequest } from '../models/ElderlyProfileUpdateRequest';
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
        gender?: 'male' | 'female' | 'unknown',
        careLevel?: string,
        status?: 'active' | 'inactive',
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
     * @param requestBody
     * @returns ApiElderly 成功
     * @throws ApiError
     */
    public createElderlyProfile(
        requestBody: ElderlyProfileCreateRequest,
    ): CancelablePromise<ApiElderly> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/elderly-profiles',
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
                404: `数据不存在`,
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
        requestBody: ElderlyProfileUpdateRequest,
    ): CancelablePromise<ApiElderly> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/elderly-profiles/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存在`,
                409: `数据冲突或仍被引用`,
            },
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
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存在`,
                409: `数据冲突或仍被引用`,
            },
        });
    }
    /**
     * 查询老人关联预警
     * @param id
     * @returns ApiWarningList 成功
     * @throws ApiError
     */
    public getElderlyWarnings(
        id: string,
    ): CancelablePromise<ApiWarningList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}/warnings',
            path: {
                'id': id,
            },
            errors: {
                404: `数据不存在`,
            },
        });
    }
    /**
     * 查询老人关联报告
     * @param id
     * @returns ApiAssessmentReportList 成功
     * @throws ApiError
     */
    public getElderlyReports(
        id: string,
    ): CancelablePromise<ApiAssessmentReportList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}/reports',
            path: {
                'id': id,
            },
            errors: {
                404: `数据不存在`,
            },
        });
    }
    /**
     * 查询老人关联设备
     * @param id
     * @returns ApiDeviceList 成功
     * @throws ApiError
     */
    public getElderlyDevices(
        id: string,
    ): CancelablePromise<ApiDeviceList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}/devices',
            path: {
                'id': id,
            },
            errors: {
                404: `数据不存在`,
            },
        });
    }
    /**
     * 查询老人重点人群记录
     * @param id
     * @returns ApiKeyPopulationList 成功
     * @throws ApiError
     */
    public getElderlyKeyPopulations(
        id: string,
    ): CancelablePromise<ApiKeyPopulationList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}/key-populations',
            path: {
                'id': id,
            },
            errors: {
                404: `数据不存在`,
            },
        });
    }
}
