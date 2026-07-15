package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.config.security.CustomUserDetails;
import csulzc.medical_big_data_cloud.module.dto.response.report.AssessmentReportResponse;
import csulzc.medical_big_data_cloud.module.dto.request.user.ChangePasswordRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.ProfileUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.elderly.ElderlyProfileResponse;
import csulzc.medical_big_data_cloud.module.dto.response.user.TodoResponse;
import csulzc.medical_big_data_cloud.module.dto.response.user.UserResponse;
import csulzc.medical_big_data_cloud.module.service.ElderlyProfileService;
import csulzc.medical_big_data_cloud.module.service.AssessmentReportService;
import csulzc.medical_big_data_cloud.module.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

import java.util.List;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
@Validated
@Tag(name = "Profile", description = "个人中心")
public class ProfileController {
    private final UserService userService;
    private final ElderlyProfileService elderlyProfileService;
    private final AssessmentReportService assessmentReportService;

    @GetMapping
    public ApiResponse<UserResponse> getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return ApiResponse.success(userService.getUserById(user.getId()));
    }

    @PutMapping
    public ApiResponse<UserResponse> updateProfile(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody ProfileUpdateRequest request) {
        return ApiResponse.success(userService.updateProfile(user.getId(), request));
    }

    @PostMapping("/change-password")
    public ApiResponse<Void> changePassword(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(user.getId(), request);
        return ApiResponse.success();
    }

    @GetMapping("/elderly")
    @PreAuthorize("hasRole('elderly')")
    public ApiResponse<ElderlyProfileResponse> getMyElderlyProfile(
            @AuthenticationPrincipal CustomUserDetails user) {
        return ApiResponse.success(elderlyProfileService.getMyProfile(user.getId()));
    }

    @GetMapping("/reports")
    @PreAuthorize("hasRole('elderly')")
    public ApiResponse<PageResult<AssessmentReportResponse>> getMyReports(
            @AuthenticationPrincipal CustomUserDetails user,
            @RequestParam(defaultValue = "1") @Min(1) int pageNo,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int pageSize) {
        return ApiResponse.success(assessmentReportService.listForElderlyUser(user.getId(), pageNo, pageSize));
    }

    @GetMapping("/todos")
    public ApiResponse<List<TodoResponse>> getTodos(@AuthenticationPrincipal CustomUserDetails user) {
        return ApiResponse.success(userService.getTodos(user.getId()));
    }
}
