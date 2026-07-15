/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type HealthWarningHandleRequest = {
    status: 'processing' | 'processed' | 'closed';
    handlerId?: string;
    handlerName?: string;
    result?: string;
    nextAction?: string;
    remark?: string;
};

