package csulzc.medical_big_data_cloud.module.dto.request.warning;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HealthWarningAssignRequest {
    @NotBlank(message = "目标处理人 ID 不能为空")
    @Size(max = 64, message = "目标处理人 ID 长度不能超过 64")
    private String handlerId;

    @Size(max = 100, message = "目标处理人姓名长度不能超过 100")
    private String handlerName;

    @Size(max = 500, message = "备注长度不能超过 500")
    private String remark;
}
