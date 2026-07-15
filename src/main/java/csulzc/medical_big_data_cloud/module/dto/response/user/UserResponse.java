package csulzc.medical_big_data_cloud.module.dto.response.user;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {
    private String id;
    private String username;
    private String realName;
    private String roleCode;
    private String mobile;
    private String institutionId;
    private String regionCode;
    private String status;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
