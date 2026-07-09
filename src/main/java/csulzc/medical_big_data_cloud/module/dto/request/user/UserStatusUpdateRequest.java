package csulzc.medical_big_data_cloud.module.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserStatusUpdateRequest {
    @NotBlank(message = "状态不能为空")
    @Size(max = 20, message = "状态长度不能超过20")
    private String status;
}
