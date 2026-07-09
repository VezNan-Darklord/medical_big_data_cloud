package csulzc.medical_big_data_cloud.module.dto.response.dashboard;

import lombok.Data;

import java.util.List;

@Data
public class DashboardOverviewResponse {
    private Long totalElderlyCount;
    private Long warningCount;
    private Long unhandledWarningCount;
    private Long keyPopulationCount;
    private Double deviceOnlineRate;
    private List<TrendItem> recentTrend;

    @Data
    public static class TrendItem {
        private String date;
        private Integer value;
    }
}
