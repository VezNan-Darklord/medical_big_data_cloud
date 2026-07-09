package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardOverviewResponse;
import csulzc.medical_big_data_cloud.module.entity.HealthWarning;
import csulzc.medical_big_data_cloud.module.repository.DeviceRepository;
import csulzc.medical_big_data_cloud.module.repository.ElderlyProfileRepository;
import csulzc.medical_big_data_cloud.module.repository.HealthWarningRepository;
import csulzc.medical_big_data_cloud.module.repository.KeyPopulationRepository;
import csulzc.medical_big_data_cloud.module.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final ElderlyProfileRepository elderlyProfileRepository;
    private final HealthWarningRepository healthWarningRepository;
    private final KeyPopulationRepository keyPopulationRepository;
    private final DeviceRepository deviceRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardOverviewResponse getOverview() {
        long totalElderlyCount = elderlyProfileRepository.count();
        long warningCount = healthWarningRepository.count();
        long unhandledWarningCount = healthWarningRepository.countByStatus("unprocessed");
        long keyPopulationCount = keyPopulationRepository.count();
        long totalDeviceCount = deviceRepository.count();
        long onlineDeviceCount = deviceRepository.countByOnlineStatus("online");
        double deviceOnlineRate = totalDeviceCount == 0 ? 0.0 : (double) onlineDeviceCount / totalDeviceCount;

        List<DashboardOverviewResponse.TrendItem> recentTrend = new ArrayList<>();
        // 模拟近7天预警趋势数据，实际应从数据库聚合
        for (int i = 6; i >= 0; i--) {
            DashboardOverviewResponse.TrendItem item = new DashboardOverviewResponse.TrendItem();
            item.setDate(LocalDateTime.now().minusDays(i).toLocalDate().toString());
            item.setValue((int) (Math.random() * 10)); // 实际应替换为真实统计
            recentTrend.add(item);
        }

        DashboardOverviewResponse response = new DashboardOverviewResponse();
        response.setTotalElderlyCount(totalElderlyCount);
        response.setWarningCount(warningCount);
        response.setUnhandledWarningCount(unhandledWarningCount);
        response.setKeyPopulationCount(keyPopulationCount);
        response.setDeviceOnlineRate(Math.round(deviceOnlineRate * 100) / 100.0);
        response.setRecentTrend(recentTrend);

        return response;
    }
}
