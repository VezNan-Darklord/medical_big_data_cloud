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
    /**
     * 老人姓名（取自老人档案）。
     */
    elderlyName?: string | null;
    category?: string;
    reason?: string | null;
    level?: string;
    ownerDoctorId?: string | null;
    /**
     * 负责医生姓名。
     */
    ownerDoctorName?: string | null;
    followUpCycleDays?: number;
    status?: 'active' | 'closed';
    createdAt?: string;
    updatedAt?: string;
};

