/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Device = {
    id?: string;
    deviceName?: string;
    deviceType?: string;
    deviceSn?: string;
    elderlyId?: string | null;
    elderlyName?: string | null;
    bindingStatus?: 'bound' | 'unbound';
    onlineStatus?: 'online' | 'offline';
    lastReportAt?: string | null;
    firmwareVersion?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

