package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceBindRequest;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.device.DeviceResponse;
import csulzc.medical_big_data_cloud.module.service.DeviceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/devices")
@RequiredArgsConstructor
@Tag(name = "Device", description = "设备管理")
public class DeviceController {

    private final DeviceService deviceService;

    @PostMapping
    @Operation(summary = "创建设备", description = "创建一个新的设备记录，初始状态为未绑定、离线")
    public ApiResponse<DeviceResponse> create(@Valid @RequestBody DeviceCreateRequest request) {
        return ApiResponse.success(deviceService.create(request));
    }

    @GetMapping
    public ApiResponse<PageResult<DeviceResponse>> list(
            @RequestParam(required = false) String bindingStatus,
            @RequestParam(required = false) String onlineStatus,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(deviceService.list(bindingStatus, onlineStatus, pageNo, pageSize));
    }

    @GetMapping("/{id}")
    public ApiResponse<DeviceResponse> getById(@PathVariable String id) {
        return ApiResponse.success(deviceService.getById(id));
    }

    @PostMapping("/bind")
    public ApiResponse<Void> bind(@Valid @RequestBody DeviceBindRequest request) {
        deviceService.bind(request);
        return ApiResponse.success();
    }

    @PostMapping("/{id}/unbind")
    public ApiResponse<Void> unbind(@PathVariable String id) {
        deviceService.unbind(id);
        return ApiResponse.success();
    }

    @PutMapping("/{id}")
    public ApiResponse<DeviceResponse> update(@PathVariable String id, @Valid @RequestBody DeviceUpdateRequest request) {
        return ApiResponse.success(deviceService.update(id, request));
    }

    @GetMapping("/{id}/reports")
    public ApiResponse<String> getReports(@PathVariable String id) {
        return ApiResponse.success("设备上报记录");
    }
}
