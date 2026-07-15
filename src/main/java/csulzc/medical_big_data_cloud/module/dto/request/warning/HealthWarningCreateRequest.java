package csulzc.medical_big_data_cloud.module.dto.request.warning;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HealthWarningCreateRequest {
    @NotBlank(message = "老人 ID 不能为空")
    @Size(max = 64, message = "老人 ID 长度不能超过 64")
    private String elderlyId;

    @NotBlank(message = "预警类型不能为空")
    @Size(max = 50, message = "预警类型长度不能超过 50")
    private String warningType;

    @NotBlank(message = "严重程度不能为空")
    @Pattern(regexp = "^(low|medium|high|critical)$", message = "严重程度不合法")
    private String severity;

    @NotBlank(message = "来源不能为空")
    @Size(max = 20, message = "来源长度不能超过 20")
    private String source;

    @Size(max = 50, message = "指标名称长度不能超过 50")
    private String metricName;

    private Double metricValue;
    private Double thresholdValue;

    @Pattern(regexp = "^(unprocessed|processing|processed|closed)$", message = "预警状态不合法")
    private String status;

    @NotNull(message = "发生时间不能为空")
    private LocalDateTime occurredAt;

    @Size(max = 500, message = "备注长度不能超过 500")
    private String remark;
}
