/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterRequest = {
    username: string;
    password: string;
    realName: string;
    mobile?: string;
    /**
     * 浏览器前端只能传 elderly；服务端开启特权注册开关后，Apifox 可传 doctor 或 admin。
     */
    roleCode?: 'elderly' | 'doctor' | 'admin';
};

