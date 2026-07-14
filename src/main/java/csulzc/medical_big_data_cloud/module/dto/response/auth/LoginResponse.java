package csulzc.medical_big_data_cloud.module.dto.response.auth;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private String expireAt;
    private UserInfo user;

    @Data
    public static class UserInfo {
        private String id;
        private String realName;
        private String roleCode;
        private String mobile;
    }
}
