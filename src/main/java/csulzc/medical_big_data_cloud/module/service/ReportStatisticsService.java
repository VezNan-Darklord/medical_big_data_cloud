package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.common.result.FilePayload;
import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardChartResponse;
import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardOverviewResponse;

import java.util.List;

public interface ReportStatisticsService {
    DashboardOverviewResponse getOverview();

    List<DashboardChartResponse> getTrends();

    List<DashboardChartResponse> getDistributions();

    FilePayload export();
}
