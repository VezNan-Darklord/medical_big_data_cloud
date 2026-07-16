package csulzc.medical_big_data_cloud.module.dto.response.report;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class AssessmentReportResponse {
    private String id;
    private String elderlyId;
    private String elderlyName;
    private String reportType;
    private Integer score;
    private String grade;
    private String summary;
    private List<String> riskItems;
    private List<String> recommendations;
    private String assessorId;
    private LocalDateTime assessedAt;
    private String reviewStatus;
    private String reviewerId;
    private LocalDateTime reviewedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
