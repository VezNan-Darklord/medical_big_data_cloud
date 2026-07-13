package csulzc.medical_big_data_cloud.common.exception;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ApiResponse<Void> handleBusinessException(BusinessException e) {
        return ApiResponse.error(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ApiResponse<Void> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse("非法请求");
        return ApiResponse.error(ResultCode.BAD_REQUEST.getCode(), message);
    }

    // JWT 相关异常
    @ExceptionHandler(ExpiredJwtException.class)
    public ApiResponse<Void> handleExpiredJwtException(ExpiredJwtException e) {
        return ApiResponse.error(ResultCode.UNAUTHORIZED.getCode(), "Token已过期，请重新登录");
    }

    @ExceptionHandler({MalformedJwtException.class, SignatureException.class, IllegalArgumentException.class})
    public ApiResponse<Void> handleInvalidJwtException(Exception e) {
        return ApiResponse.error(ResultCode.UNAUTHORIZED.getCode(), "无效的Token");
    }

    // Spring Security 认证异常
    @ExceptionHandler(BadCredentialsException.class)
    public ApiResponse<Void> handleBadCredentialsException(BadCredentialsException e) {
        return ApiResponse.error(ResultCode.UNAUTHORIZED.getCode(), "用户名或密码错误");
    }

    @ExceptionHandler(DisabledException.class)
    public ApiResponse<Void> handleDisabledException(DisabledException e) {
        return ApiResponse.error(ResultCode.UNAUTHORIZED.getCode(), "账号已被禁用");
    }

    @ExceptionHandler(LockedException.class)
    public ApiResponse<Void> handleLockedException(LockedException e) {
        return ApiResponse.error(ResultCode.UNAUTHORIZED.getCode(), "账号已被锁定");
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ApiResponse<Void> handleAccessDeniedException(AccessDeniedException e) {
        return ApiResponse.error(ResultCode.FORBIDDEN.getCode(), "权限不足");
    }

    @ExceptionHandler(Exception.class)
    public ApiResponse<Void> handleException(Exception e) {
        return ApiResponse.error(ResultCode.INTERNAL_ERROR.getCode(), e.getMessage());
    }
}
