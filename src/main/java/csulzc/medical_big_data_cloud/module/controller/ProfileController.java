package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.config.security.CustomUserDetails;
import csulzc.medical_big_data_cloud.module.dto.request.user.PasswordChangeRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.UserUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.user.UserResponse;
import csulzc.medical_big_data_cloud.module.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@Tag(name = "Profile", description = "Current user profile")
public class ProfileController {
    private final UserService userService;

    @GetMapping
    public ApiResponse<UserResponse> getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return ApiResponse.success(userService.getUserById(user.getId()));
    }

    @PutMapping
    public ApiResponse<UserResponse> updateProfile(@AuthenticationPrincipal CustomUserDetails user,
                                                   @Valid @RequestBody UserUpdateRequest request) {
        // A user cannot elevate their own role or change account status through the profile API.
        request.setRoleCode(null);
        request.setStatus(null);
        return ApiResponse.success(userService.updateUser(user.getId(), request));
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(@AuthenticationPrincipal CustomUserDetails user,
                                            @Valid @RequestBody PasswordChangeRequest request) {
        userService.changePassword(user.getId(), request);
        return ApiResponse.success();
    }

    @GetMapping("/todos")
    public ApiResponse<List<Map<String, Object>>> getTodos() {
        return ApiResponse.success(List.of());
    }
}
