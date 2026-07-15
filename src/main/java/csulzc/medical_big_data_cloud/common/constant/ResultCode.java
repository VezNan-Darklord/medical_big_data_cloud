package csulzc.medical_big_data_cloud.common.constant;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ResultCode {
    SUCCESS(0, HttpStatus.OK, "success"),
    BAD_REQUEST(400, HttpStatus.BAD_REQUEST, "请求参数不合法"),
    UNAUTHORIZED(401, HttpStatus.UNAUTHORIZED, "未登录或登录已失效"),
    FORBIDDEN(403, HttpStatus.FORBIDDEN, "禁止访问"),
    NOT_FOUND(404, HttpStatus.NOT_FOUND, "数据不存在"),
    CONFLICT(409, HttpStatus.CONFLICT, "数据状态冲突"),
    INTERNAL_ERROR(500, HttpStatus.INTERNAL_SERVER_ERROR, "系统内部错误"),
    THIRD_PARTY_ERROR(501, HttpStatus.BAD_GATEWAY, "第三方服务调用失败");

    private final int code;
    private final HttpStatus httpStatus;
    private final String message;

    ResultCode(int code, HttpStatus httpStatus, String message) {
        this.code = code;
        this.httpStatus = httpStatus;
        this.message = message;
    }
}
