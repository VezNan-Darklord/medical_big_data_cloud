package csulzc.medical_big_data_cloud.module.dto.request.report;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssessmentReportUpdateRequest {
    @NotBlank(message = "报告类型不能为空")
    @Pattern(regexp = "^(健康评估|康复评估|用药评估|睡眠评估)$",
            message = "报告类型必须是健康评估、康复评估、用药评估或睡眠评估")
    private String reportType;

    @NotNull(message = "评分不能为空")
    @Min(value = 0, message = "评分不能小于 0")
    @Max(value = 100, message = "评分不能大于 100")
    private Integer score;

    @NotBlank(message = "等级不能为空")
    @Pattern(regexp = "^[ABCD]$", message = "等级必须是 A、B、C 或 D")
    private String grade;

    @NotBlank(message = "综合评估结论不能为空")
    @Size(max = 2000, message = "摘要长度不能超过 2000")
    private String summary;

    @NotEmpty(message = "至少需要一项病症或风险评估")
    @Size(max = 20, message = "风险项不能超过 20 项")
    private List<@NotBlank(message = "风险项不能为空")
            @Size(max = 200, message = "风险项长度不能超过 200") String> riskItems;

    @NotEmpty(message = "至少需要一项用药或后续动作建议")
    @Size(max = 30, message = "建议不能超过 30 项")
    private List<@NotBlank(message = "建议不能为空")
            @Size(max = 200, message = "建议长度不能超过 200") String> recommendations;

    @NotNull(message = "评估时间不能为空")
    private LocalDateTime assessedAt;
}
