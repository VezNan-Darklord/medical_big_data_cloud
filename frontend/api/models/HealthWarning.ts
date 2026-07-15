/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HealthWarning = {
    id?: string;
    elderlyId?: string;
    warningType?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    source?: string;
    metricName?: string | null;
    metricValue?: number | null;
    thresholdValue?: number | null;
    status?: 'unprocessed' | 'processing' | 'processed' | 'closed';
    occurredAt?: string;
    handledAt?: string | null;
    handlerId?: string | null;
    handlerName?: string | null;
    handleResult?: string | null;
    nextAction?: string | null;
    remark?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

