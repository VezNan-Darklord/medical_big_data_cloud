/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ElderlyProfile = {
    id?: string;
    userId?: string | null;
    name?: string;
    gender?: 'male' | 'female' | 'unknown';
    birthday?: string | null;
    age?: number | null;
    phone?: string | null;
    address?: string | null;
    institutionId?: string | null;
    regionCode?: string | null;
    medicalHistory?: string | null;
    careLevel?: string | null;
    tags?: Array<string>;
    status?: 'active' | 'inactive';
    createdAt?: string;
    updatedAt?: string;
};

