/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiEmpty } from '../models/ApiEmpty';
import type { ApiObjectList } from '../models/ApiObjectList';
import type { PasswordChangeRequest } from '../models/PasswordChangeRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class ProfileService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * 修改密码
     * @param requestBody
     * @returns ApiEmpty 成功
     * @throws ApiError
     */
    public changePassword(
        requestBody: PasswordChangeRequest,
    ): CancelablePromise<ApiEmpty> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/profile/change-password',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * 我的待办
     * @returns ApiObjectList 成功
     * @throws ApiError
     */
    public getTodos(): CancelablePromise<ApiObjectList> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/profile/todos',
        });
    }
}
