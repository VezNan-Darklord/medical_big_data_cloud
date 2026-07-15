package csulzc.medical_big_data_cloud.module.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class RoleAssignRequest {
    @NotBlank(message = "角色编码不能为空")
    @Pattern(regexp = "^(admin|doctor|operator|analyst|elderly)$", message = "角色编码不合法")
    private String roleCode;
}
