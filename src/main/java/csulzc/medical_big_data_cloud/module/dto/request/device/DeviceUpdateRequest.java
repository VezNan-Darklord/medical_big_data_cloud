package csulzc.medical_big_data_cloud.module.dto.request.device;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DeviceUpdateRequest {
    @Size(max = 100, message = "设备名称长度不能超过100")
    private String deviceName;

    @Size(max = 50, message = "设备类型长度不能超过50")
    private String deviceType;

    @Size(max = 20, message = "固件版本长度不能超过20")
    private String firmwareVersion;
}
