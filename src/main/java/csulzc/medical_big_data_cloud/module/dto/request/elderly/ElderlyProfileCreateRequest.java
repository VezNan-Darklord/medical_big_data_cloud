package csulzc.medical_big_data_cloud.module.dto.request.elderly;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ElderlyProfileCreateRequest {
    @NotBlank(message = "姓名不能为空")
    @Size(max = 100, message = "姓名长度不能超过100")
    private String name;

    @NotBlank(message = "性别不能为空")
    @Size(max = 10, message = "性别长度不能超过10")
    private String gender;

    private LocalDate birthday;
    private Integer age;

    @Size(max = 20, message = "手机号长度不能超过20")
    private String phone;

    @Size(max = 500, message = "地址长度不能超过500")
    private String address;

    @Size(max = 64, message = "机构ID长度不能超过64")
    private String institutionId;

    @Size(max = 1000, message = "病史长度不能超过1000")
    private String medicalHistory;

    @Size(max = 10, message = "护理等级长度不能超过10")
    private String careLevel;

    private List<String> tags;

    @Size(max = 20, message = "状态长度不能超过20")
    private String status;
}
