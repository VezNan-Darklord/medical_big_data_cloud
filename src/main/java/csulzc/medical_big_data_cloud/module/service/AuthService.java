package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.module.dto.request.auth.LoginRequest;
import csulzc.medical_big_data_cloud.module.dto.response.auth.LoginResponse;

public interface AuthService {

    LoginResponse login(LoginRequest request);

    LoginResponse.UserInfo getCurrentUser();

    void logout();
}
