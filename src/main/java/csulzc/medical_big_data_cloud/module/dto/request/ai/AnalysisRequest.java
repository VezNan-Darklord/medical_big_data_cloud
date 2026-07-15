package csulzc.medical_big_data_cloud.module.dto.request.ai;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record AnalysisRequest(
        @NotBlank
        @Pattern(regexp = "^care_decision_analysis$", message = "暂不支持该分析场景")
        String scene,
        String tenantId,
        String regionCode,
        @Valid TimeRange timeRange,
        @NotNull @Valid Metrics metrics,
        @Valid Dimensions dimensions,
        @Valid Constraints constraints
) {
    public record TimeRange(String start, String end) {
    }

    public record Metrics(
            @Min(0) long elderlyCount,
            @Min(0) long warningCount,
            @Min(0) long unhandledWarningCount,
            @Min(0) long highRiskPopulationCount,
            @Min(0) @Max(1) double deviceOnlineRate
    ) {
    }

    public record Dimensions(List<String> groupBy) {
    }

    public record Constraints(
            String language,
            String outputFormat,
            @Min(1) @Max(10) Integer maxInsightCount,
            List<String> mustInclude
    ) {
    }
}
