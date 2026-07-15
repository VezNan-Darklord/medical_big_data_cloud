package csulzc.medical_big_data_cloud.module.dto.request.user;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {
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
