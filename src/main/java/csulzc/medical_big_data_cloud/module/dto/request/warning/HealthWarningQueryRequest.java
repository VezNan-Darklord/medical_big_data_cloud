package csulzc.medical_big_data_cloud.module.dto.request.warning;

import csulzc.medical_big_data_cloud.module.dto.request.PageQuery;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
public class HealthWarningQueryRequest extends PageQuery {
    @Size(max = 64, message = "老人ID长度不能超过64")
    private String elderlyId;

    @Size(max = 50, message = "预警类型长度不能超过50")
    private String warningType;

    @Size(max = 20, message = "严重程度长度不能超过20")
    private String severity;

    @Size(max = 20, message = "状态长度不能超过20")
    private String status;

    @Size(max = 20, message = "来源长度不能超过20")
    private String source;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
