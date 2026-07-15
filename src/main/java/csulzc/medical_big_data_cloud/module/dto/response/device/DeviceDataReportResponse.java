package csulzc.medical_big_data_cloud.module.dto.response.device;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class DeviceDataReportResponse {
    private String id;
    private String deviceId;
    private LocalDateTime reportedAt;
    private Map<String, Object> metrics;
}
