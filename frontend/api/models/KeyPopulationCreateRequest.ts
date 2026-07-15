/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type KeyPopulationCreateRequest = {
    elderlyId: string;
    category: string;
    reason?: string;
    level?: string;
    ownerDoctorId?: string;
    followUpCycleDays?: number;
    status?: 'active' | 'closed';
};

