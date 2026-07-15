/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type DashboardChart = {
    chartType: 'line' | 'bar' | 'pie';
    title: string;
    xAxis: Array<string>;
    series: Array<{
        name?: string;
        data?: Array<number>;
    }>;
};

