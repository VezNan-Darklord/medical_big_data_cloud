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
@Table(name = "device_data_report", indexes = {
        @Index(name = "idx_device_report_device", columnList = "device_id"),
        @Index(name = "idx_device_report_time", columnList = "reported_at")
})
@SQLDelete(sql = "UPDATE device_data_report SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class DeviceDataReport extends BaseEntity {
    @Column(nullable = false, length = 64)
    private String deviceId;

    @Column(nullable = false)
    private LocalDateTime reportedAt;

    @Column(nullable = false, columnDefinition = "text")
    private String metricsJson;
}
