/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoleCode } from './RoleCode';
export type UserCreateRequest = {
    username: string;
    password: string;
    realName: string;
    roleCode: RoleCode;
    mobile?: string;
    institutionId?: string;
    regionCode?: string;
    status?: 'enabled' | 'disabled';
};

