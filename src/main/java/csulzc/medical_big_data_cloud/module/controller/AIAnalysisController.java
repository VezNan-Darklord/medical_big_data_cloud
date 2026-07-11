package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/ai/analysis/care-decision")
@Tag(name = "AIAnalysis", description = "Structured care decision analysis")
public class AIAnalysisController {
    private final Map<String, AnalysisResult> history = new ConcurrentHashMap<>();

    @PostMapping
    public ApiResponse<AnalysisResult> analyze(@Valid @RequestBody AnalysisRequest request) {
        String id = UUID.randomUUID().toString();
        Metrics metrics = request.metrics();
        boolean warningRisk = metrics.unhandledWarningCount() > 0;
        Insight insight = new Insight(
                warningRisk ? "risk" : "trend",
                warningRisk ? "存在未处理健康预警" : "当前健康预警处置平稳",
                warningRisk ? "当前仍有 " + metrics.unhandledWarningCount() + " 条预警待处理。" : "当前没有待处理预警。",
                0.85,
                warningRisk ? "优先安排医护人员复核高风险预警。" : "保持现有巡检与随访频率。"
        );
        AnalysisResult result = new AnalysisResult(id, request.scene(),
                warningRisk ? "当前运营总体平稳，但未处理预警需要优先关注。" : "当前运营总体平稳。",
                List.of(insight),
                warningRisk ? List.of(new Action("review_warnings", "unhandledWarnings", "high", "提高预警处置及时率")) : List.of(),
                List.of(new Chart("line", "健康预警趋势", "warningTrend")), LocalDateTime.now());
        history.put(id, result);
        return ApiResponse.success(result);
    }

    @GetMapping("/history")
    public ApiResponse<List<AnalysisResult>> history() {
        return ApiResponse.success(history.values().stream()
                .sorted((a, b) -> b.createdAt().compareTo(a.createdAt())).toList());
    }

    @GetMapping("/{id}")
    public ApiResponse<AnalysisResult> get(@PathVariable String id) {
        AnalysisResult result = history.get(id);
        if (result == null) throw new BusinessException(404, "分析记录不存在");
        return ApiResponse.success(result);
    }

    public record AnalysisRequest(@NotBlank String scene, String tenantId, String regionCode,
                                  TimeRange timeRange, @NotNull @Valid Metrics metrics,
                                  Dimensions dimensions, Constraints constraints) {}
    public record TimeRange(String start, String end) {}
    public record Metrics(@Min(0) long elderlyCount, @Min(0) long warningCount,
                          @Min(0) long unhandledWarningCount, @Min(0) long highRiskPopulationCount,
                          @Min(0) @Max(1) double deviceOnlineRate) {}
    public record Dimensions(List<String> groupBy) {}
    public record Constraints(String language, String outputFormat, Integer maxInsightCount,
                              List<String> mustInclude) {}
    public record AnalysisResult(String id, String scene, String summary, List<Insight> insights,
                                 List<Action> actions, List<Chart> charts, LocalDateTime createdAt) {}
    public record Insight(String type, String title, String description, double confidence, String suggestion) {}
    public record Action(String actionType, String target, String priority, String expectedEffect) {}
    public record Chart(String chartType, String title, String optionKey) {}
}
