package csulzc.medical_big_data_cloud.module.dto.request.device;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

@Data
public class DeviceDataReportRequest {
    private LocalDateTime reportedAt;

    @NotEmpty(message = "上报指标不能为空")
    private Map<String, Object> metrics;
}
