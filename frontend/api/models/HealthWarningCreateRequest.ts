/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HealthWarningCreateRequest = {
    /**
     * 管理员、医生和运营人员传老人档案 ID；老人本人创建时可省略，服务端自动使用本人关联档案。
     */
    elderlyId?: string;
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

