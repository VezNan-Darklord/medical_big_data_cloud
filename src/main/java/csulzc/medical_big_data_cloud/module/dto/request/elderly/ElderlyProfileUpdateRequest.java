package csulzc.medical_big_data_cloud.module.dto.request.elderly;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ElderlyProfileUpdateRequest {
    @Size(max = 64, message = "用户 ID 长度不能超过 64")
    private String userId;

    @Size(max = 100, message = "姓名长度不能超过 100")
    private String name;

    @Pattern(regexp = "^(male|female|unknown)$", message = "性别必须是 male、female 或 unknown")
    private String gender;

    private LocalDate birthday;
    private Integer age;

    @Size(max = 20, message = "手机号长度不能超过 20")
    private String phone;

    @Size(max = 500, message = "地址长度不能超过 500")
    private String address;

    @Size(max = 64, message = "机构 ID 长度不能超过 64")
    private String institutionId;

    @Size(max = 64, message = "区域编码长度不能超过 64")
    private String regionCode;

    @Size(max = 1000, message = "病史长度不能超过 1000")
    private String medicalHistory;

    @Size(max = 10, message = "护理等级长度不能超过 10")
    private String careLevel;

    private List<@Size(max = 50, message = "单个标签长度不能超过 50") String> tags;

    @Pattern(regexp = "^(active|inactive)$", message = "状态必须是 active 或 inactive")
    private String status;
}
