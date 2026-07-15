package csulzc.medical_big_data_cloud.module.dto.response.report;

import lombok.Data;

@Data
public class StatisticsOverviewResponse {
    private Long totalElderlyCount;
    private Long totalDoctorCount;
    private Long totalDeviceCount;
    private Long unboundDeviceCount;
    private Double deviceOnlineRate;
    private Long totalWarningCount;
    private Long unhandledWarningCount;
}
