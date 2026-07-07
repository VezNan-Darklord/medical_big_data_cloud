package csulzc.medical_big_data_cloud.module.health.entity;

import csulzc.medical_big_data_cloud.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "health_warning")
public class HealthWarning extends BaseEntity {

    @Column(nullable = false, length = 64)
    private String elderlyId;

    @Column(nullable = false, length = 50)
    private String warningType;

    @Column(nullable = false, length = 20)
    private String severity;

    @Column(nullable = false, length = 20)
    private String source;

    @Column(length = 50)
    private String metricName;

    private Double metricValue;

    private Double thresholdValue;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(nullable = false)
    private LocalDateTime occurredAt;

    private LocalDateTime handledAt;

    @Column(length = 64)
    private String handlerId;

    @Column(length = 500)
    private String remark;
}
