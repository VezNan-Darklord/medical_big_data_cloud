package csulzc.medical_big_data_cloud.module.dto.request.warning;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HealthWarningHandleRequest {
    @NotBlank(message = "处理状态不能为空")
    @Size(max = 20, message = "状态长度不能超过20")
    private String status;

    @Size(max = 64, message = "处理人ID长度不能超过64")
    private String handlerId;

    @Size(max = 100, message = "处理人姓名长度不能超过100")
    private String handlerName;

    @Size(max = 500, message = "处理结果长度不能超过500")
    private String result;

    @Size(max = 50, message = "下一步操作长度不能超过50")
    private String nextAction;

    @Size(max = 500, message = "备注长度不能超过500")
    private String remark;
}
