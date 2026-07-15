package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningAssignRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningHandleRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningQueryRequest;
import csulzc.medical_big_data_cloud.module.dto.response.warning.HealthWarningResponse;
import csulzc.medical_big_data_cloud.module.service.HealthWarningService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health-warnings")
@RequiredArgsConstructor
@Tag(name = "HealthWarning", description = "健康预警")
public class HealthWarningController {

    private final HealthWarningService healthWarningService;

    @PostMapping
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator', 'elderly')")
    public ResponseEntity<ApiResponse<HealthWarningResponse>> create(
            @Valid @RequestBody HealthWarningCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(healthWarningService.create(request)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator', 'elderly')")
    public ApiResponse<PageResult<HealthWarningResponse>> list(@Valid HealthWarningQueryRequest request) {
        return ApiResponse.success(healthWarningService.list(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator', 'elderly')")
    public ApiResponse<HealthWarningResponse> getById(@PathVariable String id) {
        return ApiResponse.success(healthWarningService.getById(id));
    }

    @PostMapping("/{id}/handle")
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<HealthWarningResponse> handle(
            @PathVariable String id, @Valid @RequestBody HealthWarningHandleRequest request) {
        return ApiResponse.success(healthWarningService.handle(id, request));
    }

    @PostMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<HealthWarningResponse> assign(
            @PathVariable String id, @Valid @RequestBody HealthWarningAssignRequest request) {
        return ApiResponse.success(healthWarningService.assign(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ApiResponse<Void> delete(@PathVariable String id) {
        healthWarningService.delete(id);
        return ApiResponse.success();
    }
}
