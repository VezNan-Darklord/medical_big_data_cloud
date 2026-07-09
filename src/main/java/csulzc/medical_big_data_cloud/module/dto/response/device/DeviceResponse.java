package csulzc.medical_big_data_cloud.module.dto.response.device;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DeviceResponse {
    private String id;
    private String deviceName;
    private String deviceType;
    private String deviceSn;
    private String elderlyId;
    private String bindingStatus;
    private String onlineStatus;
    private LocalDateTime lastReportAt;
    private String firmwareVersion;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
