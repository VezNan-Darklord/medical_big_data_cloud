package csulzc.medical_big_data_cloud.module.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class PageQuery {
    @Min(value = 1, message = "页码必须从1开始")
    private int pageNo = 1;

    @Min(value = 1, message = "每页条数必须大于0")
    @Max(value = 100, message = "每页条数不能超过100")
    private int pageSize = 10;
}
