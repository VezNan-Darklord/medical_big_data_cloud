package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.config.security.CustomUserDetails;
import csulzc.medical_big_data_cloud.module.dto.request.user.ProfileUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.elderly.ElderlyProfileResponse;
import csulzc.medical_big_data_cloud.module.dto.response.user.UserResponse;
import csulzc.medical_big_data_cloud.module.service.ElderlyProfileService;
import csulzc.medical_big_data_cloud.module.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
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
    private final ElderlyProfileService elderlyProfileService;

    /**
     * 统一个人资料更新
     * 支持修改：对外展示信息(realName)、个人隐私信息(mobile)、密码(oldPassword+newPassword)
     * 所有字段均为可选，仅传入非空字段会被更新
     */
    @PutMapping
    public ApiResponse<UserResponse> updateProfile(@AuthenticationPrincipal CustomUserDetails user,
                                                   @Valid @RequestBody ProfileUpdateRequest request) {
        return ApiResponse.success(userService.updateProfile(user.getId(), request));
    }

    @GetMapping("/elderly")
    @PreAuthorize("hasRole('elderly')")
    @Operation(summary = "我的健康档案", description = "当前登录老人查看自己的健康档案（基于JWT自动识别）")
    public ApiResponse<ElderlyProfileResponse> getMyElderlyProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return ApiResponse.success(elderlyProfileService.getMyProfile(user.getId()));
    }


    @GetMapping("/todos")
    public ApiResponse<List<Map<String, Object>>> getTodos() {
        return ApiResponse.success(List.of());
    }
}
