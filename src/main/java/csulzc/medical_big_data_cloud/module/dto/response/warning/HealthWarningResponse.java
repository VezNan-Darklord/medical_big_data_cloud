package csulzc.medical_big_data_cloud.module.dto.response.warning;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HealthWarningResponse {
    private String id;
    private String elderlyId;
    private String warningType;
    private String severity;
    private String source;
    private String metricName;
    private Double metricValue;
    private Double thresholdValue;
    private String status;
    private LocalDateTime occurredAt;
    private LocalDateTime handledAt;
    private String handlerId;
    private String remark;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
