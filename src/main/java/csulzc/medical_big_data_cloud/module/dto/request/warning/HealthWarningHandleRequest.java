package csulzc.medical_big_data_cloud.module.dto.request.warning;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HealthWarningHandleRequest {
    @NotBlank(message = "处理状态不能为空")
    @Pattern(regexp = "^(processing|processed|closed)$", message = "处理状态不合法")
    private String status;

    @Size(max = 64, message = "处理人 ID 长度不能超过 64")
    private String handlerId;

    @Size(max = 100, message = "处理人姓名长度不能超过 100")
    private String handlerName;

    @Size(max = 500, message = "处理结果长度不能超过 500")
    private String result;

    @Size(max = 50, message = "下一步操作长度不能超过 50")
    private String nextAction;

    @Size(max = 500, message = "备注长度不能超过 500")
    private String remark;
}
