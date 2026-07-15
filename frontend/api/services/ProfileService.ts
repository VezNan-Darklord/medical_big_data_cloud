/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiAssessmentReportPage } from '../models/ApiAssessmentReportPage';
import type { ApiElderly } from '../models/ApiElderly';
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiTodoList } from '../models/ApiTodoList';
import type { ApiUser } from '../models/ApiUser';
import type { ChangePasswordRequest } from '../models/ChangePasswordRequest';
import type { ProfileUpdateRequest } from '../models/ProfileUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProfileService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 获取个人资料
     * @returns ApiUser 成功
     * @throws ApiError
     */
    public getProfile(): CancelablePromise<ApiUser> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/profile',
        });
    }
    /**
     * 更新个人资料
     * @param requestBody
     * @returns ApiUser 成功
     * @throws ApiError
     */
    public updateProfile(
        requestBody: ProfileUpdateRequest,
    ): CancelablePromise<ApiUser> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/profile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数或业务输入错误`,
                409: `数据冲突或仍被引用`,
            },
        });
    }
    /**
     * 修改当前用户密码
     * @param requestBody
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public changePassword(
        requestBody: ChangePasswordRequest,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/profile/change-password',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `参数或业务输入错误`,
            },
        });
    }
    /**
     * 当前老人账号的关联档�?
     * @returns ApiElderly 成功
     * @throws ApiError
     */
    public getMyElderlyProfile(): CancelablePromise<ApiElderly> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/profile/elderly',
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存在`,
            },
        });
    }
    /**
     * 当前老人账号的评估报�?
     * 仅老人账号可访问，只返回其关联档案下的报告�?
     * @param pageNo
     * @param pageSize
     * @returns ApiAssessmentReportPage 成功
     * @throws ApiError
     */
    public getMyAssessmentReports(
        pageNo: number = 1,
        pageSize: number = 10,
    ): CancelablePromise<ApiAssessmentReportPage> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/profile/reports',
            query: {
                'pageNo': pageNo,
                'pageSize': pageSize,
            },
            errors: {
                403: `当前角色无权访问`,
                404: `数据不存在`,
            },
        });
    }
    /**
     * 当前用户待办
     * @returns ApiTodoList 成功
     * @throws ApiError
     */
    public getTodos(): CancelablePromise<ApiTodoList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/profile/todos',
        });
    }
}
