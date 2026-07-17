/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Device = {
    id?: string;
    deviceName?: string;
    deviceType?: string;
    deviceSn?: string;
    /**
     * 绑定的老人账户用户 ID（非老人档案 ID）。
     */
    elderlyId?: string | null;
    elderlyName?: string | null;
    bindingStatus?: 'bound' | 'unbound';
    onlineStatus?: 'online' | 'offline';
    lastReportAt?: string | null;
    firmwareVersion?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

