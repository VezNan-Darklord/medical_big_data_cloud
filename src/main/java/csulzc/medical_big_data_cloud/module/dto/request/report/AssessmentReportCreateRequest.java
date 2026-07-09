package csulzc.medical_big_data_cloud.module.dto.request.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssessmentReportCreateRequest {
    @NotBlank(message = "老人ID不能为空")
    @Size(max = 64, message = "老人ID长度不能超过64")
    private String elderlyId;

    @NotBlank(message = "报告类型不能为空")
    @Size(max = 50, message = "报告类型长度不能超过50")
    private String reportType;

    private Integer score;

    @Size(max = 10, message = "等级长度不能超过10")
    private String grade;

    @Size(max = 2000, message = "摘要长度不能超过2000")
    private String summary;

    private List<String> riskItems;
    private List<String> recommendations;

    @Size(max = 64, message = "评估人ID长度不能超过64")
    private String assessorId;

    private LocalDateTime assessedAt;
}
