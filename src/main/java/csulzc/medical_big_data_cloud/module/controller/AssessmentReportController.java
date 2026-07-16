package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.FilePayload;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.common.util.SecurityUtil;
import csulzc.medical_big_data_cloud.module.dto.request.report.AssessmentReportCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.report.AssessmentReportReviewRequest;
import csulzc.medical_big_data_cloud.module.dto.request.report.AssessmentReportUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.report.AssessmentReportResponse;
import csulzc.medical_big_data_cloud.module.service.AssessmentReportService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

import java.nio.charset.StandardCharsets;

@Validated
@RestController
@RequestMapping("/assessment-reports")
@RequiredArgsConstructor
@Tag(name = "AssessmentReport", description = "评估报告")
public class AssessmentReportController {

    private final AssessmentReportService assessmentReportService;

    @GetMapping
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<PageResult<AssessmentReportResponse>> list(
            @RequestParam(required = false) String elderlyId,
            @RequestParam(defaultValue = "1") @Min(1) int pageNo,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int pageSize) {
        return ApiResponse.success(assessmentReportService.list(elderlyId, pageNo, pageSize));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<AssessmentReportResponse> getById(@PathVariable String id) {
        return ApiResponse.success(assessmentReportService.getById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<AssessmentReportResponse> update(
            @PathVariable String id, @Valid @RequestBody AssessmentReportUpdateRequest request) {
        return ApiResponse.success(assessmentReportService.update(id, request));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ResponseEntity<ApiResponse<AssessmentReportResponse>> create(
            @Valid @RequestBody AssessmentReportCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(assessmentReportService.create(request)));
    }

    @PostMapping("/{id}/review")
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<AssessmentReportResponse> review(
            @PathVariable String id, @Valid @RequestBody AssessmentReportReviewRequest request) {
        return ApiResponse.success(assessmentReportService.review(id, request));
    }

    @GetMapping("/elderly")
    @PreAuthorize("hasRole('elderly')")
    public ApiResponse<PageResult<AssessmentReportResponse>> listForElderly(
            @RequestParam(defaultValue = "1") @Min(1) int pageNo,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int pageSize) {
        return ApiResponse.success(assessmentReportService.listForElderlyUser(
                SecurityUtil.getCurrentUserId(), pageNo, pageSize));
    }

    @GetMapping("/elderly/{id}")
    @PreAuthorize("hasRole('elderly')")
    public ApiResponse<AssessmentReportResponse> getByIdForElderly(@PathVariable String id) {
        return ApiResponse.success(assessmentReportService.getById(id));
    }

    @GetMapping("/elderly/{id}/export")
    @PreAuthorize("hasRole('elderly')")
    public ResponseEntity<byte[]> exportForElderly(@PathVariable String id) {
        FilePayload file = assessmentReportService.export(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(file.fileName(), StandardCharsets.UTF_8)
                                .build().toString())
                .body(file.content());
    }
    @GetMapping("/{id}/export")
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ResponseEntity<byte[]> export(@PathVariable String id) {
        FilePayload file = assessmentReportService.export(id);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(file.fileName(), StandardCharsets.UTF_8)
                                .build().toString())
                .body(file.content());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<Void> delete(@PathVariable String id) {
        assessmentReportService.delete(id);
        return ApiResponse.success();
    }
}
