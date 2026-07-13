/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_ArrayAssessmentReportResponse } from '../models/ApiResponse_ArrayAssessmentReportResponse';
import type { ApiResponse_ArrayDeviceResponse } from '../models/ApiResponse_ArrayDeviceResponse';
import type { ApiResponse_ArrayHealthWarningResponse } from '../models/ApiResponse_ArrayHealthWarningResponse';
import type { ApiResponse_ArrayKeyPopulationResponse } from '../models/ApiResponse_ArrayKeyPopulationResponse';
import type { ApiResponse_ElderlyProfileResponse } from '../models/ApiResponse_ElderlyProfileResponse';
import type { ApiResponse_PageResult_ElderlyProfileResponse } from '../models/ApiResponse_PageResult_ElderlyProfileResponse';
import type { ApiResponse_Void } from '../models/ApiResponse_Void';
import type { ElderlyProfileCreateRequest } from '../models/ElderlyProfileCreateRequest';
import type { ElderlyProfileUpdateRequest } from '../models/ElderlyProfileUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ElderlyProfileService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 老人列表
     * @param keyword
     * @param gender
     * @param careLevel
     * @param status
     * @param regionCode
     * @param pageNo
     * @param pageSize
     * @returns ApiResponse_PageResult_ElderlyProfileResponse 成功
     * @throws ApiError
     */
    public listElderlyProfiles(
        keyword?: string,
        gender?: string,
        careLevel?: string,
        status?: string,
        regionCode?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiResponse_PageResult_ElderlyProfileResponse> {
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
     * @returns ApiResponse_ElderlyProfileResponse 成功
     * @throws ApiError
     */
    public createElderlyProfile(
        requestBody: ElderlyProfileCreateRequest,
    ): CancelablePromise<ApiResponse_ElderlyProfileResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/elderly-profiles',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 获取老人详情
     * @param id
     * @returns ApiResponse_ElderlyProfileResponse 成功
     * @throws ApiError
     */
    public getElderlyProfileById(
        id: string,
    ): CancelablePromise<ApiResponse_ElderlyProfileResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 编辑老人档案
     * @param id
     * @param requestBody
     * @returns ApiResponse_ElderlyProfileResponse 成功
     * @throws ApiError
     */
    public updateElderlyProfile(
        id: string,
        requestBody: ElderlyProfileUpdateRequest,
    ): CancelablePromise<ApiResponse_ElderlyProfileResponse> {
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
     * 删除老人档案
     * @param id
     * @returns ApiResponse_Void 成功
     * @throws ApiError
     */
    public deleteElderlyProfile(
        id: string,
    ): CancelablePromise<ApiResponse_Void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/elderly-profiles/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 获取老人关联预警
     * @param id
     * @returns ApiResponse_ArrayHealthWarningResponse 成功
     * @throws ApiError
     */
    public getElderlyWarnings(
        id: string,
    ): CancelablePromise<ApiResponse_ArrayHealthWarningResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}/warnings',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 获取老人关联报告
     * @param id
     * @returns ApiResponse_ArrayAssessmentReportResponse 成功
     * @throws ApiError
     */
    public getElderlyReports(
        id: string,
    ): CancelablePromise<ApiResponse_ArrayAssessmentReportResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}/reports',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 获取老人关联设备
     * @param id
     * @returns ApiResponse_ArrayDeviceResponse 成功
     * @throws ApiError
     */
    public getElderlyDevices(
        id: string,
    ): CancelablePromise<ApiResponse_ArrayDeviceResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}/devices',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 获取老人关联重点人群
     * @param id
     * @returns ApiResponse_ArrayKeyPopulationResponse 成功
     * @throws ApiError
     */
    public getElderlyKeyPopulations(
        id: string,
    ): CancelablePromise<ApiResponse_ArrayKeyPopulationResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/elderly-profiles/{id}/key-populations',
            path: {
                'id': id,
            },
        });
    }
}
