package csulzc.medical_big_data_cloud.module.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserStatusUpdateRequest {
    @NotBlank(message = "状态不能为空")
    @Pattern(regexp = "^(enabled|disabled)$", message = "状态必须是 enabled 或 disabled")
    private String status;
}
