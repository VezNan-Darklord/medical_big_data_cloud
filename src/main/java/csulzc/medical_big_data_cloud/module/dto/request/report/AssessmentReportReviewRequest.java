package csulzc.medical_big_data_cloud.module.dto.request.report;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class AssessmentReportReviewRequest {
    @NotBlank(message = "复核状态不能为空")
    @Pattern(regexp = "^(approved|rejected)$", message = "复核状态必须是 approved 或 rejected")
    private String reviewStatus;
}
