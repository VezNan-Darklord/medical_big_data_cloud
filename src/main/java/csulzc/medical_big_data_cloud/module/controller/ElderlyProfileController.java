package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileQueryRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.device.DeviceResponse;
import csulzc.medical_big_data_cloud.module.dto.response.elderly.ElderlyProfileResponse;
import csulzc.medical_big_data_cloud.module.dto.response.keypop.KeyPopulationResponse;
import csulzc.medical_big_data_cloud.module.dto.response.report.AssessmentReportResponse;
import csulzc.medical_big_data_cloud.module.dto.response.warning.HealthWarningResponse;
import csulzc.medical_big_data_cloud.module.service.ElderlyProfileService;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/elderly-profiles")
@RequiredArgsConstructor
@Tag(name = "ElderlyProfile", description = "老人档案")
public class ElderlyProfileController {

    private final ElderlyProfileService elderlyProfileService;

    @GetMapping
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator')")
    public ApiResponse<PageResult<ElderlyProfileResponse>> list(@Valid ElderlyProfileQueryRequest request) {
        return ApiResponse.success(elderlyProfileService.list(request));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator')")
    public ApiResponse<ElderlyProfileResponse> getById(@PathVariable String id) {
        return ApiResponse.success(elderlyProfileService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ResponseEntity<ApiResponse<ElderlyProfileResponse>> create(
            @Valid @RequestBody ElderlyProfileCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(elderlyProfileService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<ElderlyProfileResponse> update(
            @PathVariable String id, @Valid @RequestBody ElderlyProfileUpdateRequest request) {
        return ApiResponse.success(elderlyProfileService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ApiResponse<Void> delete(@PathVariable String id) {
        elderlyProfileService.delete(id);
        return ApiResponse.success();
    }

    @GetMapping("/{id}/warnings")
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator')")
    public ApiResponse<List<HealthWarningResponse>> getWarnings(@PathVariable String id) {
        return ApiResponse.success(elderlyProfileService.getWarnings(id));
    }

    @GetMapping("/{id}/reports")
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator')")
    public ApiResponse<List<AssessmentReportResponse>> getReports(@PathVariable String id) {
        return ApiResponse.success(elderlyProfileService.getReports(id));
    }

    @GetMapping("/{id}/devices")
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator')")
    public ApiResponse<List<DeviceResponse>> getDevices(@PathVariable String id) {
        return ApiResponse.success(elderlyProfileService.getDevices(id));
    }

    @GetMapping("/{id}/key-populations")
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator')")
    public ApiResponse<List<KeyPopulationResponse>> getKeyPopulations(@PathVariable String id) {
        return ApiResponse.success(elderlyProfileService.getKeyPopulations(id));
    }
}
