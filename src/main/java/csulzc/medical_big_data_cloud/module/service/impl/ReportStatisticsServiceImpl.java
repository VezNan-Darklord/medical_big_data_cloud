package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.result.FilePayload;
import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardChartResponse;
import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardOverviewResponse;
import csulzc.medical_big_data_cloud.module.service.DashboardService;
import csulzc.medical_big_data_cloud.module.service.ReportStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportStatisticsServiceImpl implements ReportStatisticsService {

    private final DashboardService dashboardService;

    @Override
    public DashboardOverviewResponse getOverview() {
        return dashboardService.getOverview();
    }

    @Override
    public List<DashboardChartResponse> getTrends() {
        return dashboardService.getCharts().stream()
                .filter(chart -> "line".equals(chart.getChartType()))
                .toList();
    }

    @Override
    public List<DashboardChartResponse> getDistributions() {
        return dashboardService.getCharts().stream()
                .filter(chart -> !"line".equals(chart.getChartType()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public FilePayload export() {
        DashboardOverviewResponse overview = getOverview();
        String csv = "\uFEFF指标,数值\n"
                + "老人总数," + overview.getTotalElderlyCount() + "\n"
                + "预警总数," + overview.getWarningCount() + "\n"
                + "未处理预警," + overview.getUnhandledWarningCount() + "\n"
                + "重点人群," + overview.getKeyPopulationCount() + "\n"
                + "设备在线率," + overview.getDeviceOnlineRate() + "\n";
        return new FilePayload("statistics-" + LocalDate.now() + ".csv",
                "text/csv;charset=UTF-8", csv.getBytes(StandardCharsets.UTF_8));
    }
}
