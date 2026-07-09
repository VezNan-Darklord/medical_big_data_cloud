package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileQueryRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.report.AssessmentReportResponse;
import csulzc.medical_big_data_cloud.module.dto.response.device.DeviceResponse;
import csulzc.medical_big_data_cloud.module.dto.response.elderly.ElderlyProfileResponse;
import csulzc.medical_big_data_cloud.module.dto.response.keypop.KeyPopulationResponse;
import csulzc.medical_big_data_cloud.module.dto.response.warning.HealthWarningResponse;
import csulzc.medical_big_data_cloud.module.service.ElderlyProfileService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/elderly-profiles")
@RequiredArgsConstructor
@Tag(name = "Elderly Profile", description = "老人资料管理")
public class ElderlyProfileController {

    private final ElderlyProfileService elderlyProfileService;

    @GetMapping
    public ApiResponse<PageResult<ElderlyProfileResponse>> list(ElderlyProfileQueryRequest request) {
        return ApiResponse.success(elderlyProfileService.list(request));
    }

    @GetMapping("/{id}")
    public ApiResponse<ElderlyProfileResponse> getById(@PathVariable String id) {
        return ApiResponse.success(elderlyProfileService.getById(id));
    }

    @PostMapping
    public ApiResponse<ElderlyProfileResponse> create(@Valid @RequestBody ElderlyProfileCreateRequest request) {
        return ApiResponse.success(elderlyProfileService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<ElderlyProfileResponse> update(@PathVariable String id, @Valid @RequestBody ElderlyProfileUpdateRequest request) {
        return ApiResponse.success(elderlyProfileService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable String id) {
        elderlyProfileService.delete(id);
        return ApiResponse.success();
    }

    @GetMapping("/{id}/warnings")
    public ApiResponse<List<HealthWarningResponse>> getWarnings(@PathVariable String id) {
        return ApiResponse.success(List.of());
    }

    @GetMapping("/{id}/reports")
    public ApiResponse<List<AssessmentReportResponse>> getReports(@PathVariable String id) {
        return ApiResponse.success(List.of());
    }

    @GetMapping("/{id}/devices")
    public ApiResponse<List<DeviceResponse>> getDevices(@PathVariable String id) {
        return ApiResponse.success(List.of());
    }

    @GetMapping("/{id}/key-populations")
    public ApiResponse<List<KeyPopulationResponse>> getKeyPopulations(@PathVariable String id) {
        return ApiResponse.success(List.of());
    }
}
