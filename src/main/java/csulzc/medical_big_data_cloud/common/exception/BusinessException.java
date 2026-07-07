package csulzc.medical_big_data_cloud.common.exception;

import lombok.Getter;
import csulzc.medical_big_data_cloud.common.constant.ResultCode;

@Getter
public class BusinessException extends RuntimeException {
    private final int code;

    public BusinessException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.code = resultCode.getCode();
    }

    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }
}
