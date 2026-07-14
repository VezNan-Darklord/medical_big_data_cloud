package csulzc.medical_big_data_cloud.module.dto.request.user;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 统一个人资料更新请求
 * 涵盖：对外展示信息(realName)、个人隐私信息(mobile)、密码修改(oldPassword + newPassword)
 * 所有字段均为可选，仅传入非空字段会被更新
 */
@Data
public class ProfileUpdateRequest {

    // ==================== 对外展示信息 ====================

    @Size(max = 50, message = "真实姓名长度不能超过50")
    private String realName;

    // ==================== 个人隐私信息 ====================

    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String mobile;

    // ==================== 密码修改 ====================
    // 两个字段需成对出现：同时提供时触发密码修改，都不提供时忽略

    private String oldPassword;

    @Size(min = 6, max = 20, message = "新密码长度必须在6-20之间")
    private String newPassword;
}
