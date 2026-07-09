package csulzc.medical_big_data_cloud.module.dto.request.user;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserUpdateRequest {
    @Size(max = 50, message = "真实姓名长度不能超过50")
    private String realName;

    @Size(max = 20, message = "角色编码长度不能超过20")
    private String roleCode;

    @Size(max = 20, message = "手机号长度不能超过20")
    private String mobile;

    @Size(max = 20, message = "状态长度不能超过20")
    private String status;
}
