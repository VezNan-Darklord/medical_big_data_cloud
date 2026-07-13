/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HealthWarningCreateRequest = {
    elderlyId: string;
    warningType: string;
    severity: string;
    source: string;
    metricName?: string;
    metricValue?: number;
    thresholdValue?: number;
    status: string;
    occurredAt: string;
    remark?: string;
};

