/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AssessmentReportCreateRequest = {
    elderlyId: string;
    reportType: string;
    score?: number | null;
    grade?: string | null;
    summary?: string | null;
    riskItems?: Array<string> | null;
    recommendations?: Array<string> | null;
    assessorId?: string | null;
    assessedAt?: string | null;
};

