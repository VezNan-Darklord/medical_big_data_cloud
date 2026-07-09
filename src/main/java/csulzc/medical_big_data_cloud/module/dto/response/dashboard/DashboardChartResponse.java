package csulzc.medical_big_data_cloud.module.dto.response.dashboard;

import lombok.Data;

import java.util.List;

@Data
public class DashboardChartResponse {
    private String chartType;
    private String title;
    private List<String> xAxis;
    private List<SeriesItem> series;

    @Data
    public static class SeriesItem {
        private String name;
        private List<? extends Number> data;
    }
}
