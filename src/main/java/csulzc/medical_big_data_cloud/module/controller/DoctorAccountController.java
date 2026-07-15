package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.user.PasswordRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.UserCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.UserUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.user.UserResponse;
import csulzc.medical_big_data_cloud.module.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/doctor-accounts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('admin')")
@Tag(name = "DoctorAccount", description = "医生账户")
public class DoctorAccountController {

    private final UserService userService;

    @GetMapping
    public ApiResponse<PageResult<UserResponse>> list(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") @Min(1) int pageNo,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int pageSize) {
        return ApiResponse.success(userService.listUsers(null, "doctor", status, pageNo, pageSize));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserResponse>> create(@Valid @RequestBody UserCreateRequest request) {
        request.setRoleCode("doctor");
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(userService.createUser(request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<UserResponse> update(
            @PathVariable String id, @Valid @RequestBody UserUpdateRequest request) {
        request.setRoleCode("doctor");
        return ApiResponse.success(userService.updateUser(id, request));
    }

    @PostMapping("/{id}/reset-password")
    public ApiResponse<Void> resetPassword(
            @PathVariable String id, @Valid @RequestBody PasswordRequest request) {
        userService.resetPassword(id, request.getNewPassword());
        return ApiResponse.success();
    }
}
