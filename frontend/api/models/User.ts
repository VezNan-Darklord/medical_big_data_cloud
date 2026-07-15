/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RoleCode } from './RoleCode';
export type User = {
    id?: string;
    username?: string;
    realName?: string;
    roleCode?: RoleCode;
    mobile?: string | null;
    institutionId?: string | null;
    regionCode?: string | null;
    status?: 'enabled' | 'disabled';
    lastLoginAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

