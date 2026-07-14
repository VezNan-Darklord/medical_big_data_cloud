package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningHandleRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningQueryRequest;
import csulzc.medical_big_data_cloud.module.dto.response.warning.HealthWarningResponse;
import csulzc.medical_big_data_cloud.module.service.HealthWarningService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningCreateRequest;

@RestController
@RequestMapping("/health-warnings")
@RequiredArgsConstructor
@Tag(name = "Health Warning", description = "健康预警")
public class HealthWarningController {

    private final HealthWarningService healthWarningService;

    @PostMapping
    public ApiResponse<HealthWarningResponse> create(@Valid @RequestBody HealthWarningCreateRequest request) {
        return ApiResponse.success(healthWarningService.create(request));
    }

    @GetMapping
    public ApiResponse<PageResult<HealthWarningResponse>> list(HealthWarningQueryRequest request) {
        return ApiResponse.success(healthWarningService.list(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<HealthWarningResponse> getById(@PathVariable String id) {
        return ApiResponse.success(healthWarningService.getById(id));
    }

    @PostMapping("/{id}/handle")
    public ApiResponse<Void> handle(@PathVariable String id, @Valid @RequestBody HealthWarningHandleRequest request) {
        healthWarningService.handle(id, request);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/assign")
    public ApiResponse<Void> assign(@PathVariable String id, @RequestBody String targetHandlerId) {
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<Void> delete(@PathVariable String id) {
        healthWarningService.delete(id);
        return ApiResponse.success();
    }
}
