package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardChartResponse;
import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardOverviewResponse;

import java.util.List;

public interface DashboardService {
    DashboardOverviewResponse getOverview();

    List<DashboardChartResponse> getCharts();
}
