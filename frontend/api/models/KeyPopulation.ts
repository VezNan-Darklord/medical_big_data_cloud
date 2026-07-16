/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type KeyPopulation = {
    id?: string;
    /**
     * 老人账户本人的用户 ID，不是老人档案 ID。
     */
    elderlyId?: string;
    category?: string;
    reason?: string | null;
    level?: string;
    ownerDoctorId?: string | null;
    followUpCycleDays?: number;
    status?: 'active' | 'closed';
    createdAt?: string;
    updatedAt?: string;
};

