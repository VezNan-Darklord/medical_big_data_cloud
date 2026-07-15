package csulzc.medical_big_data_cloud.module.dto.request.device;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DeviceUpdateRequest {
    @Size(max = 100, message = "设备名称长度不能超过 100")
    private String deviceName;

    @Size(max = 50, message = "设备类型长度不能超过 50")
    private String deviceType;

    @Size(max = 20, message = "固件版本长度不能超过 20")
    private String firmwareVersion;

    @Pattern(regexp = "^(online|offline)$", message = "在线状态必须是 online 或 offline")
    private String onlineStatus;
}
