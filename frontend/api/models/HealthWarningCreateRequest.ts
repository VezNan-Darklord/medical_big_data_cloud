/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HealthWarningCreateRequest = {
    elderlyId: string;
    warningType: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    source: string;
    metricName?: string;
    metricValue?: number;
    thresholdValue?: number;
    status?: 'unprocessed' | 'processing' | 'processed' | 'closed';
    occurredAt: string;
    remark?: string;
};

