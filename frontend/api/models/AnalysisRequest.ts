/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AnalysisRequest = {
    scene: string;
    tenantId?: string;
    regionCode?: string;
    timeRange?: {
        start?: string;
        end?: string;
    };
    metrics: {
        elderlyCount: number;
        warningCount: number;
        unhandledWarningCount: number;
        highRiskPopulationCount: number;
        deviceOnlineRate: number;
    };
    dimensions?: {
        groupBy?: Array<string>;
    };
    constraints?: {
        language?: string;
        outputFormat?: string;
        maxInsightCount?: number;
        mustInclude?: Array<string>;
    };
};

