/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ElderlyProfileUpdateRequest = {
    userId?: string;
    name?: string;
    gender?: 'male' | 'female' | 'unknown';
    birthday?: string;
    age?: number;
    phone?: string;
    address?: string;
    institutionId?: string;
    regionCode?: string;
    medicalHistory?: string;
    careLevel?: string;
    tags?: Array<string>;
    status?: 'active' | 'inactive';
};

