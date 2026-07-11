package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.report.AssessmentReportCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.report.AssessmentReportResponse;
import csulzc.medical_big_data_cloud.module.service.AssessmentReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assessment-reports")
@RequiredArgsConstructor
@Tag(name = "Assessment Report", description = "评估报告管理")
public class AssessmentReportController {

    private final AssessmentReportService assessmentReportService;

    @GetMapping
    public ApiResponse<PageResult<AssessmentReportResponse>> list(
            @RequestParam(required = false) String elderlyId,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int pageSize) {
        if (elderlyId != null) {
            return ApiResponse.success(assessmentReportService.listByElderlyId(elderlyId, pageNo, pageSize));
        }
        return ApiResponse.success(new PageResult<>(List.of(), pageNo, pageSize, 0));
    }

    @GetMapping("/{id}")
    public ApiResponse<AssessmentReportResponse> getById(@PathVariable String id) {
        return ApiResponse.success(assessmentReportService.getById(id));
    }

    @PostMapping
    public ApiResponse<AssessmentReportResponse> create(@Valid @RequestBody AssessmentReportCreateRequest request) {
        return ApiResponse.success(assessmentReportService.create(request));
    }

    @GetMapping("/{id}/export")
    public ApiResponse<String> export(@PathVariable String id) {
        return ApiResponse.success("导出链接"); // 实际生成并返回导出URL
    }
}
