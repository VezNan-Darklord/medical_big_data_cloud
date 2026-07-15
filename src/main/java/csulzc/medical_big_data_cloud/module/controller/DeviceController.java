package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceBindRequest;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceDataReportRequest;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.device.DeviceDataReportResponse;
import csulzc.medical_big_data_cloud.module.dto.response.device.DeviceResponse;
import csulzc.medical_big_data_cloud.module.service.DeviceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
@Tag(name = "Device", description = "设备管理")
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping
    @PreAuthorize("hasAnyRole('admin', 'operator')")
    public ResponseEntity<ApiResponse<DeviceResponse>> create(@Valid @RequestBody DeviceCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(deviceService.create(request)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator')")
    public ApiResponse<PageResult<DeviceResponse>> list(
            @RequestParam(required = false) String bindingStatus,
            @RequestParam(required = false) String onlineStatus,
            @RequestParam(defaultValue = "1") @Min(1) int pageNo,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int pageSize) {
        return ApiResponse.success(deviceService.list(bindingStatus, onlineStatus, pageNo, pageSize));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator')")
    public ApiResponse<DeviceResponse> getById(@PathVariable String id) {
        return ApiResponse.success(deviceService.getById(id));
    }

    @PostMapping("/bind")
    @PreAuthorize("hasAnyRole('admin', 'operator')")
    public ApiResponse<DeviceResponse> bind(@Valid @RequestBody DeviceBindRequest request) {
        return ApiResponse.success(deviceService.bind(request));
    }

    @PostMapping("/{id}/unbind")
    @PreAuthorize("hasAnyRole('admin', 'operator')")
    public ApiResponse<DeviceResponse> unbind(@PathVariable String id) {
        return ApiResponse.success(deviceService.unbind(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'operator')")
    public ApiResponse<DeviceResponse> update(
            @PathVariable String id, @Valid @RequestBody DeviceUpdateRequest request) {
        return ApiResponse.success(deviceService.update(id, request));
    }

    @GetMapping("/{id}/reports")
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator')")
    public ApiResponse<List<DeviceDataReportResponse>> getReports(@PathVariable String id) {
        return ApiResponse.success(deviceService.getReports(id));
    }

    @PostMapping("/{id}/reports")
    @PreAuthorize("hasAnyRole('admin', 'operator')")
    public ResponseEntity<ApiResponse<DeviceDataReportResponse>> recordReport(
            @PathVariable String id, @Valid @RequestBody DeviceDataReportRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(deviceService.recordReport(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('admin')")
    public ApiResponse<Void> delete(@PathVariable String id) {
        deviceService.delete(id);
        return ApiResponse.success();
    }
}
