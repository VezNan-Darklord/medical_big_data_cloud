package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.module.dto.request.auth.LoginRequest;
import csulzc.medical_big_data_cloud.module.dto.request.auth.RegisterRequest;
import csulzc.medical_big_data_cloud.module.dto.response.auth.LoginResponse;
import csulzc.medical_big_data_cloud.module.dto.response.user.UserResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);

    LoginResponse register(RegisterRequest request, String userAgent);

    UserResponse getCurrentUser();

    void logout(String refreshToken);

    LoginResponse refreshToken(String refreshToken);
}
