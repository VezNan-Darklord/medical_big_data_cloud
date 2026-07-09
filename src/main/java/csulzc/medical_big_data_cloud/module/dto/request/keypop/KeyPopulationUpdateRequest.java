package csulzc.medical_big_data_cloud.module.dto.request.keypop;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class KeyPopulationUpdateRequest {
    @Size(max = 50, message = "分类长度不能超过50")
    private String category;

    @Size(max = 500, message = "原因长度不能超过500")
    private String reason;

    @Size(max = 10, message = "等级长度不能超过10")
    private String level;

    @Size(max = 64, message = "负责医生ID长度不能超过64")
    private String ownerDoctorId;

    private Integer followUpCycleDays;

    @Size(max = 20, message = "状态长度不能超过20")
    private String status;
}
