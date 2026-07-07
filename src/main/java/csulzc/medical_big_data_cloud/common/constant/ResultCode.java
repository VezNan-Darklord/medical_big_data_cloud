package csulzc.medical_big_data_cloud.common.constant;

import lombok.Getter;

@Getter
public enum ResultCode {
    SUCCESS(200, "success"),
    BAD_REQUEST(400, "非法请求"),
    UNAUTHORIZED(401, "未登录或登录失效"),
    FORBIDDEN(403, "禁止访问"),
    NOT_FOUND(404, "数据不存在"),
    INTERNAL_ERROR(500, "系统内部错误"),
    THIRD_PARTY_ERROR(501, "第三方服务调用失败");

    private final int code;
    private final String message;

    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
}
