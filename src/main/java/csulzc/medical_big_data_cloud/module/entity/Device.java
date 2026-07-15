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
@Table(name = "device", indexes = {
        @Index(name = "idx_device_sn", columnList = "device_sn", unique = true),
        @Index(name = "idx_device_elderly", columnList = "elderly_id"),
        @Index(name = "idx_device_binding", columnList = "binding_status"),
        @Index(name = "idx_device_online", columnList = "online_status")
})
@SQLDelete(sql = "UPDATE device SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class Device extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String deviceName;

    @Column(nullable = false, length = 50)
    private String deviceType;

    @Column(nullable = false, unique = true, length = 100)
    private String deviceSn;

    @Column(length = 64)
    private String elderlyId;

    @Column(nullable = false, length = 20)
    private String bindingStatus = "unbound";

    @Column(nullable = false, length = 20)
    private String onlineStatus = "offline";

    private LocalDateTime lastReportAt;

    @Column(length = 20)
    private String firmwareVersion;
}
