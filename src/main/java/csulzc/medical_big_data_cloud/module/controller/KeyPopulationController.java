package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.keypop.KeyPopulationCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.keypop.KeyPopulationUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.keypop.KeyPopulationResponse;
import csulzc.medical_big_data_cloud.module.service.KeyPopulationService;
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

@Validated
@RestController
@RequestMapping("/key-populations")
@RequiredArgsConstructor
@Tag(name = "KeyPopulation", description = "重点人群")
public class KeyPopulationController {

    private final KeyPopulationService keyPopulationService;

    @GetMapping
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator')")
    public ApiResponse<PageResult<KeyPopulationResponse>> list(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") @Min(1) int pageNo,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int pageSize) {
        return ApiResponse.success(keyPopulationService.list(status, pageNo, pageSize));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'operator')")
    public ApiResponse<KeyPopulationResponse> get(@PathVariable String id) {
        return ApiResponse.success(keyPopulationService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ResponseEntity<ApiResponse<KeyPopulationResponse>> create(
            @Valid @RequestBody KeyPopulationCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(keyPopulationService.create(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<KeyPopulationResponse> update(
            @PathVariable String id, @Valid @RequestBody KeyPopulationUpdateRequest request) {
        return ApiResponse.success(keyPopulationService.update(id, request));
    }

    @PostMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<Void> close(@PathVariable String id) {
        keyPopulationService.close(id);
        return ApiResponse.success();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<Void> delete(@PathVariable String id) {
        keyPopulationService.delete(id);
        return ApiResponse.success();
    }
}
