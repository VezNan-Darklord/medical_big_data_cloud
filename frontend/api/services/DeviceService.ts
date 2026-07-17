/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiDevice } from '../models/ApiDevice';
import type { ApiDevicePage } from '../models/ApiDevicePage';
import type { ApiDeviceReport } from '../models/ApiDeviceReport';
import type { ApiDeviceReportList } from '../models/ApiDeviceReportList';
import type { ApiEmpty } from '../models/ApiEmpty';
import type { DeviceBindRequest } from '../models/DeviceBindRequest';
import type { DeviceCreateRequest } from '../models/DeviceCreateRequest';
import type { DeviceDataReportRequest } from '../models/DeviceDataReportRequest';
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
     * @returns ApiDevicePage 成功
     * @throws ApiError
     */
    public listDevices(
        bindingStatus?: 'bound' | 'unbound',
        onlineStatus?: 'online' | 'offline',
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiDevicePage> {
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
     * 管理员、医生和运营人员可创建设备。
     * @param requestBody
     * @returns ApiDevice 成功
     * @throws ApiError
     */
    public createDevice(
        requestBody: DeviceCreateRequest,
    ): CancelablePromise<ApiDevice> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/devices',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `当前角色无权访问`,
                409: `数据冲突或仍被引用`,
            },
        });
    }
    /**
     * 绑定设备到老人账户
     * elderlyId 为老人账户用户 ID（非老人档案 ID），管理员、医生和运营人员可操作。
     * @param requestBody
     * @returns ApiDevice 成功
     * @throws ApiError
     */
    public bindDevice(
        requestBody: DeviceBindRequest,
    ): CancelablePromise<ApiDevice> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/devices/bind',
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
     * 设备详情
     * @param id
     * @returns ApiDevice 成功
     * @throws ApiError
     */
    public getDevice(
        id: string,
    ): CancelablePromise<ApiDevice> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/devices/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `数据不存在`,
            },
        });
    }
    /**
     * 更新设备
     * @param id
     * @param requestBody
     * @returns ApiDevice 成功
     * @throws ApiError
     */
    public updateDevice(
        id: string,
        requestBody: DeviceUpdateRequest,
    ): CancelablePromise<ApiDevice> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/devices/{id}',
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
     * 软删除设备
     * 仅管理员可删除设备，医生无权删除。
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
                403: `当前角色无权访问`,
                404: `数据不存在`,
                409: `数据冲突或仍被引用`,
            },
        });
    }
    /**
     * 解绑设备
     * @param id
     * @returns ApiDevice 成功
     * @throws ApiError
     */
    public unbindDevice(
        id: string,
    ): CancelablePromise<ApiDevice> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/devices/{id}/unbind',
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
     * 查询最近 100 条设备上报
     * @param id
     * @returns ApiDeviceReportList 成功
     * @throws ApiError
     */
    public getDeviceReports(
        id: string,
    ): CancelablePromise<ApiDeviceReportList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/devices/{id}/reports',
            path: {
                'id': id,
            },
            errors: {
                404: `数据不存在`,
            },
        });
    }
    /**
     * 写入设备数据上报
     * @param id
     * @param requestBody
     * @returns ApiDeviceReport 成功
     * @throws ApiError
     */
    public recordDeviceReport(
        id: string,
        requestBody: DeviceDataReportRequest,
    ): CancelablePromise<ApiDeviceReport> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/devices/{id}/reports',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数或业务输入错误`,
                403: `当前角色无权访问`,
                404: `数据不存在`,
            },
        });
    }
}
