package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.module.dto.request.ai.AnalysisRequest;
import csulzc.medical_big_data_cloud.module.dto.response.ai.AnalysisResult;
import csulzc.medical_big_data_cloud.module.service.AIAnalysisService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/ai/analysis/care-decision")
@RequiredArgsConstructor
@Tag(name = "AIAnalysis", description = "结构化照护决策分析")
public class AIAnalysisController {

    private final AIAnalysisService analysisService;

    @PostMapping
    @PreAuthorize("hasAnyRole('admin', 'doctor')")
    public ApiResponse<AnalysisResult> analyze(@Valid @RequestBody AnalysisRequest request) {
        return ApiResponse.success(analysisService.analyze(request));
    }

    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'analyst')")
    public ApiResponse<List<AnalysisResult>> history() {
        return ApiResponse.success(analysisService.history());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('admin', 'doctor', 'analyst')")
    public ApiResponse<AnalysisResult> get(@PathVariable String id) {
        return ApiResponse.success(analysisService.get(id));
    }
}
