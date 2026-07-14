/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiObject } from '../models/ApiObject';
import type { ApiObjectList } from '../models/ApiObjectList';
import type { ApiObjectPage } from '../models/ApiObjectPage';
import type { DeviceBindRequest } from '../models/DeviceBindRequest';
import type { DeviceCreateRequest } from '../models/DeviceCreateRequest';
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
     * @returns ApiObjectPage 成功
     * @throws ApiError
     */
    public listDevices(
        bindingStatus?: string,
        onlineStatus?: string,
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiObjectPage> {
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
     * 新增设备
     * @param requestBody
     * @returns ApiObject 成功
     * @throws ApiError
     */
    public createDevice(
        requestBody: DeviceCreateRequest,
    ): CancelablePromise<ApiObject> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/devices',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 设备详情
     * @param id
     * @returns ApiObject 成功
     * @throws ApiError
     */
    public getDevice(
        id: string,
    ): CancelablePromise<ApiObject> {
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
     * @returns ApiObject 成功
     * @throws ApiError
     */
    public updateDevice(
        id: string,
        requestBody: DeviceUpdateRequest,
    ): CancelablePromise<ApiObject> {
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
     * 删除设备
     * @param id
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public deleteDevice(
        id: string,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/devices/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `业务错误`,
            },
        });
    }
    /**
     * 绑定设备
     * @param requestBody
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public bindDevice(
        requestBody: DeviceBindRequest,
    ): CancelablePromise<ApiEmpty> {
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
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public unbindDevice(
        id: string,
    ): CancelablePromise<ApiEmpty> {
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
     * @returns ApiObjectList 成功
     * @throws ApiError
     */
    public getDeviceReports(
        id: string,
    ): CancelablePromise<ApiObjectList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/devices/{id}/reports',
            path: {
                'id': id,
            },
        });
    }
}
