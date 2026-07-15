package csulzc.medical_big_data_cloud.module.entity;

import csulzc.medical_big_data_cloud.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "health_warning", indexes = {
        @Index(name = "idx_warning_elderly", columnList = "elderly_id"),
        @Index(name = "idx_warning_status", columnList = "status"),
        @Index(name = "idx_warning_severity", columnList = "severity"),
        @Index(name = "idx_warning_occurred", columnList = "occurred_at")
})
@SQLDelete(sql = "UPDATE health_warning SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
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
    private String status = "unprocessed";

    @Column(nullable = false)
    private LocalDateTime occurredAt;

    private LocalDateTime handledAt;

    @Column(length = 64)
    private String handlerId;

    @Column(length = 100)
    private String handlerName;

    @Column(length = 500)
    private String handleResult;

    @Column(length = 50)
    private String nextAction;

    @Column(length = 500)
    private String remark;
}
