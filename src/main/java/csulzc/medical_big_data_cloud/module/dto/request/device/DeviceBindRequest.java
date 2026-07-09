package csulzc.medical_big_data_cloud.module.dto.request.device;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class DeviceBindRequest {
    @NotBlank(message = "设备ID不能为空")
    @Size(max = 64, message = "设备ID长度不能超过64")
    private String deviceId;

    @NotBlank(message = "老人ID不能为空")
    @Size(max = 64, message = "老人ID长度不能超过64")
    private String elderlyId;
}
