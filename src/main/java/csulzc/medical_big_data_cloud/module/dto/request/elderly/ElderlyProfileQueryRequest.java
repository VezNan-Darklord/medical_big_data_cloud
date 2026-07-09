package csulzc.medical_big_data_cloud.module.dto.request.elderly;

import csulzc.medical_big_data_cloud.module.dto.request.PageQuery;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ElderlyProfileQueryRequest extends PageQuery {
    @Size(max = 100, message = "关键词长度不能超过100")
    private String keyword;

    @Size(max = 10, message = "性别长度不能超过10")
    private String gender;

    @Size(max = 10, message = "护理等级长度不能超过10")
    private String careLevel;

    @Size(max = 20, message = "状态长度不能超过20")
    private String status;

    @Size(max = 64, message = "区域编码长度不能超过64")
    private String regionCode;
}
