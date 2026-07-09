package csulzc.medical_big_data_cloud.module.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserCreateRequest {
    @NotBlank(message = "用户名不能为空")
    @Size(max = 50, message = "用户名长度不能超过50")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Size(min = 6, max = 20, message = "密码长度必须在6-20之间")
    private String password;          // 明文密码，Service层加密后存入 passwordHash

    @Size(max = 50, message = "真实姓名长度不能超过50")
    private String realName;

    @NotBlank(message = "角色编码不能为空")
    @Size(max = 20, message = "角色编码长度不能超过20")
    private String roleCode;

    @Size(max = 20, message = "手机号长度不能超过20")
    private String mobile;

    @Size(max = 20, message = "状态长度不能超过20")
    private String status;
}
