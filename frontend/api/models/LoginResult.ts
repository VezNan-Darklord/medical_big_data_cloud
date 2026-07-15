/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LoginUserInfo } from './LoginUserInfo';
export type LoginResult = {
    /**
     * 兼容旧前端的 accessToken 别名
     */
    token: string;
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    /**
     * 兼容旧前端的 accessExpireAt 别名
     */
    expireAt: string;
    accessExpireAt: string;
    refreshExpireAt: string;
    user: LoginUserInfo;
};

