/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ProfileUpdateRequest = {
    /**
     * 对外展示信息-真实姓名
     */
    realName?: string;
    /**
     * 个人隐私信息-手机号
     */
    mobile?: string;
    /**
     * 旧密码，与newPassword成对出现时触发密码修改
     */
    oldPassword?: string;
    /**
     * 新密码
     */
    newPassword?: string;
};

