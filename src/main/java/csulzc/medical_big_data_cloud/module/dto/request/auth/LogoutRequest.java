package csulzc.medical_big_data_cloud.module.dto.request.auth;

import lombok.Data;

@Data
public class LogoutRequest {
    private String refreshToken;
}
