package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.keypop.KeyPopulationCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.keypop.KeyPopulationUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.keypop.KeyPopulationResponse;
import csulzc.medical_big_data_cloud.module.service.KeyPopulationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/key-populations")
@RequiredArgsConstructor
@Tag(name = "Key Population", description = "关键人群管理")
public class KeyPopulationController {

    private final KeyPopulationService keyPopulationService;

    @GetMapping
    public ApiResponse<PageResult<KeyPopulationResponse>> list(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {
        return ApiResponse.success(keyPopulationService.list(status, pageNo, pageSize));
    }

    @PostMapping
    public ApiResponse<KeyPopulationResponse> create(@Valid @RequestBody KeyPopulationCreateRequest request) {
        return ApiResponse.success(keyPopulationService.create(request));
    }

    @PutMapping("/{id}")
    public ApiResponse<KeyPopulationResponse> update(@PathVariable String id, @Valid @RequestBody KeyPopulationUpdateRequest request) {
        return ApiResponse.success(keyPopulationService.update(id, request));
    }

    @PostMapping("/{id}/close")
    public ApiResponse<Void> close(@PathVariable String id) {
        keyPopulationService.close(id);
        return ApiResponse.success();
    }
}
