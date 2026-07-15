package csulzc.medical_big_data_cloud.module.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequest {
    @NotBlank(message = "refreshToken 不能为空")
    private String refreshToken;
}
