package csulzc.medical_big_data_cloud.module.dto.response.keypop;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class KeyPopulationResponse {
    private String id;
    private String elderlyId;
    private String elderlyName;
    private String category;
    private String reason;
    private String level;
    private String ownerDoctorId;
    private String ownerDoctorName;
    private Integer followUpCycleDays;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
