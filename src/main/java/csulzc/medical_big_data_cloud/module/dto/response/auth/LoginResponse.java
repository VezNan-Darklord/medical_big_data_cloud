package csulzc.medical_big_data_cloud.module.dto.response.auth;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private String expireAt;
    private String accessExpireAt;
    private String refreshExpireAt;
    private UserInfo user;

    @Data
    public static class UserInfo {
        private String id;
        private String realName;
        private String roleCode;
        private String mobile;
    }
}
