package csulzc.medical_big_data_cloud.module.dto.request.report;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssessmentReportCreateRequest {
    @NotBlank(message = "老人 ID 不能为空")
    @Size(max = 64, message = "老人 ID 长度不能超过 64")
    private String elderlyId;

    @NotBlank(message = "报告类型不能为空")
    @Size(max = 50, message = "报告类型长度不能超过 50")
    private String reportType;

    @Min(value = 0, message = "评分不能小于 0")
    @Max(value = 100, message = "评分不能大于 100")
    private Integer score;

    @Size(max = 10, message = "等级长度不能超过 10")
    private String grade;

    @Size(max = 2000, message = "摘要长度不能超过 2000")
    private String summary;

    private List<@Size(max = 200, message = "风险项长度不能超过 200") String> riskItems;
    private List<@Size(max = 200, message = "建议长度不能超过 200") String> recommendations;

    @Size(max = 64, message = "评估人 ID 长度不能超过 64")
    private String assessorId;

    private LocalDateTime assessedAt;
}
