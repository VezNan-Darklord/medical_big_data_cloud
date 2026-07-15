package csulzc.medical_big_data_cloud.module.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserCreateRequest {
    @NotBlank(message = "用户名不能为空")
    @Size(min = 3, max = 50, message = "用户名长度必须在 3 到 50 之间")
    @Pattern(regexp = "^[A-Za-z0-9_]+$", message = "用户名只能包含字母、数字和下划线")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 8, max = 64, message = "密码长度必须在 8 到 64 之间")
    private String password;

    @NotBlank(message = "真实姓名不能为空")
    @Size(max = 50, message = "真实姓名长度不能超过 50")
    private String realName;

    @Pattern(regexp = "^(admin|doctor|operator|analyst|elderly)$", message = "角色编码不合法")
    private String roleCode;

    @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确")
    private String mobile;

    @Size(max = 64, message = "机构 ID 长度不能超过 64")
    private String institutionId;

    @Size(max = 64, message = "区域编码长度不能超过 64")
    private String regionCode;

    @Pattern(regexp = "^(enabled|disabled)$", message = "状态必须是 enabled 或 disabled")
    private String status;
}
