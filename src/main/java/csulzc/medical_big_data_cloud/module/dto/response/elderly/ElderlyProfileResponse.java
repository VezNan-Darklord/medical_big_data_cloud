package csulzc.medical_big_data_cloud.module.dto.response.elderly;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ElderlyProfileResponse {
    private String id;
    private String name;
    private String gender;
    private LocalDate birthday;
    private Integer age;
    private String phone;
    private String address;
    private String institutionId;
    private String medicalHistory;
    private String careLevel;
    private List<String> tags;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
