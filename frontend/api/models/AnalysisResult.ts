/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AnalysisResult = {
    id?: string;
    scene?: string;
    summary?: string;
    insights?: Array<{
        type?: string;
        title?: string;
        description?: string;
        confidence?: number;
        suggestion?: string;
    }>;
    actions?: Array<{
        actionType?: string;
        target?: string;
        priority?: string;
        expectedEffect?: string;
    }>;
    charts?: Array<{
        chartType?: string;
        title?: string;
        optionKey?: string;
    }>;
    createdAt?: string;
};

