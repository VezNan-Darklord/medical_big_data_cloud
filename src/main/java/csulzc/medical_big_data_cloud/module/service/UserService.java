package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.user.ChangePasswordRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.ProfileUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.UserCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.UserStatusUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.UserUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.user.UserResponse;
import csulzc.medical_big_data_cloud.module.dto.response.user.TodoResponse;

import java.util.List;

public interface UserService {
    UserResponse createUser(UserCreateRequest request);

    UserResponse updateProfile(String id, ProfileUpdateRequest request);

    UserResponse updateUser(String id, UserUpdateRequest request);

    UserResponse updateUserForRole(String id, String roleCode, UserUpdateRequest request);

    void updateStatus(String id, UserStatusUpdateRequest request);

    void updateStatusForRole(String id, String roleCode, UserStatusUpdateRequest request);

    void resetPassword(String id, String newPassword);

    void resetPasswordForRole(String id, String roleCode, String newPassword);

    void changePassword(String id, ChangePasswordRequest request);

    void assignRole(String id, String roleCode);

    UserResponse getUserById(String id);

    UserResponse getUserByUsername(String username);

    PageResult<UserResponse> listUsers(String keyword, String roleCode, String status, int pageNo, int pageSize);

    List<TodoResponse> getTodos(String userId);

    void delete(String id);
}
