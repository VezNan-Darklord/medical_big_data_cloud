/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponse_DeviceResponse } from '../models/ApiResponse_DeviceResponse';
import type { ApiResponse_PageResult_DeviceResponse } from '../models/ApiResponse_PageResult_DeviceResponse';
import type { ApiResponse_String } from '../models/ApiResponse_String';
import type { ApiResponse_Void } from '../models/ApiResponse_Void';
import type { DeviceBindRequest } from '../models/DeviceBindRequest';
import type { DeviceUpdateRequest } from '../models/DeviceUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DeviceService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 设备列表
     * @param bindingStatus
     * @param onlineStatus
     * @param pageNo
     * @param pageSize
     * @returns ApiResponse_PageResult_DeviceResponse 成功
     * @throws ApiError
     */
    public listDevices(
        bindingStatus?: string,
        onlineStatus?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiResponse_PageResult_DeviceResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/devices',
            query: {
                'bindingStatus': bindingStatus,
                'onlineStatus': onlineStatus,
                'pageNo': pageNo,
                'pageSize': pageSize,
            },
        });
    }
    /**
     * 设备详情
     * @param id
     * @returns ApiResponse_DeviceResponse 成功
     * @throws ApiError
     */
    public getDeviceById(
        id: string,
    ): CancelablePromise<ApiResponse_DeviceResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/devices/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 更新设备
     * @param id
     * @param requestBody
     * @returns ApiResponse_DeviceResponse 成功
     * @throws ApiError
     */
    public updateDevice(
        id: string,
        requestBody: DeviceUpdateRequest,
    ): CancelablePromise<ApiResponse_DeviceResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/devices/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 绑定设备
     * @param requestBody
     * @returns ApiResponse_Void 成功
     * @throws ApiError
     */
    public bindDevice(
        requestBody: DeviceBindRequest,
    ): CancelablePromise<ApiResponse_Void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/devices/bind',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 解绑设备
     * @param id
     * @returns ApiResponse_Void 成功
     * @throws ApiError
     */
    public unbindDevice(
        id: string,
    ): CancelablePromise<ApiResponse_Void> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/devices/{id}/unbind',
            path: {
                'id': id,
            },
        });
    }
    /**
     * 设备上报记录
     * @param id
     * @returns ApiResponse_String 成功
     * @throws ApiError
     */
    public getDeviceReports(
        id: string,
    ): CancelablePromise<ApiResponse_String> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/devices/{id}/reports',
            path: {
                'id': id,
            },
        });
    }
}
