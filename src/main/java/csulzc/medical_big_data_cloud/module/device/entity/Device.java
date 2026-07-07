// Device.java
// 路径: src/main/java/csulzc/medical_big_data_cloud/module/device/entity/Device.java
package csulzc.medical_big_data_cloud.module.device.entity;

import csulzc.medical_big_data_cloud.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "device")
public class Device extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String deviceName;

    @Column(nullable = false, length = 50)
    private String deviceType;

    @Column(nullable = false, length = 100)
    private String deviceSn;

    @Column(length = 64)
    private String elderlyId;

    @Column(length = 20)
    private String bindingStatus;

    @Column(length = 20)
    private String onlineStatus;

    private LocalDateTime lastReportAt;

    @Column(length = 20)
    private String firmwareVersion;
}
