/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AssessmentReport = {
    id: string;
    /**
     * 老人账户用户 ID（非老人档案 ID）。
     */
    elderlyId: string;
    elderlyName: string;
    reportType: '健康评估' | '康复评估' | '用药评估' | '睡眠评估';
    score: number;
    grade: 'A' | 'B' | 'C' | 'D';
    summary: string;
    riskItems: Array<string>;
    recommendations: Array<string>;
    assessorId: string;
    assessedAt: string;
    reviewStatus: 'draft' | 'approved' | 'rejected';
    reviewerId?: string | null;
    reviewedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
};

