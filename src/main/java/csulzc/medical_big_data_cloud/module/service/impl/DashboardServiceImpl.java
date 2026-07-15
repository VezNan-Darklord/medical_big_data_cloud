package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardChartResponse;
import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardOverviewResponse;
import csulzc.medical_big_data_cloud.module.repository.DeviceRepository;
import csulzc.medical_big_data_cloud.module.repository.ElderlyProfileRepository;
import csulzc.medical_big_data_cloud.module.repository.HealthWarningRepository;
import csulzc.medical_big_data_cloud.module.repository.KeyPopulationRepository;
import csulzc.medical_big_data_cloud.module.repository.projection.LabelCount;
import csulzc.medical_big_data_cloud.module.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        long totalDeviceCount = deviceRepository.count();
        long onlineDeviceCount = deviceRepository.countByOnlineStatus("online");

        DashboardOverviewResponse response = new DashboardOverviewResponse();
        response.setTotalElderlyCount(elderlyProfileRepository.count());
        response.setWarningCount(healthWarningRepository.count());
        response.setUnhandledWarningCount(healthWarningRepository.countByStatus("unprocessed"));
        response.setKeyPopulationCount(keyPopulationRepository.countByStatus("active"));
        response.setDeviceOnlineRate(totalDeviceCount == 0 ? 0.0
                : Math.round((double) onlineDeviceCount / totalDeviceCount * 10000.0) / 10000.0);
        response.setRecentTrend(warningTrend(7));
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DashboardChartResponse> getCharts() {
        List<DashboardChartResponse> charts = new ArrayList<>();
        charts.add(toChart("line", "近 7 日预警趋势", warningTrend(7), "预警数"));
        charts.add(distributionChart("bar", "预警等级分布",
                toCountMap(healthWarningRepository.countGroupedBySeverity()), "预警数"));
        charts.add(distributionChart("bar", "重点人群分布",
                toCountMap(keyPopulationRepository.countActiveGroupedByCategory()), "人数"));
        charts.add(distributionChart("pie", "设备在线状态",
                toCountMap(deviceRepository.countGroupedByOnlineStatus()), "设备数"));
        return charts;
    }

    private List<DashboardOverviewResponse.TrendItem> warningTrend(int days) {
        LocalDate end = LocalDate.now();
        LocalDate start = end.minusDays(days - 1L);
        Map<LocalDate, Long> counts = healthWarningRepository
                .findByOccurredAtBetweenOrderByOccurredAtAsc(start.atStartOfDay(), end.plusDays(1).atStartOfDay())
                .stream()
                .collect(Collectors.groupingBy(warning -> warning.getOccurredAt().toLocalDate(), Collectors.counting()));
        List<DashboardOverviewResponse.TrendItem> result = new ArrayList<>();
        for (int index = 0; index < days; index++) {
            LocalDate date = start.plusDays(index);
            DashboardOverviewResponse.TrendItem item = new DashboardOverviewResponse.TrendItem();
            item.setDate(date.toString());
            item.setValue(counts.getOrDefault(date, 0L).intValue());
            result.add(item);
        }
        return result;
    }

    private DashboardChartResponse toChart(String type, String title,
                                           List<DashboardOverviewResponse.TrendItem> trend, String seriesName) {
        DashboardChartResponse chart = new DashboardChartResponse();
        chart.setChartType(type);
        chart.setTitle(title);
        chart.setXAxis(trend.stream().map(DashboardOverviewResponse.TrendItem::getDate).toList());
        chart.setSeries(List.of(series(seriesName,
                trend.stream().map(DashboardOverviewResponse.TrendItem::getValue).toList())));
        return chart;
    }

    private DashboardChartResponse distributionChart(String type, String title,
                                                     Map<String, Long> counts, String seriesName) {
        DashboardChartResponse chart = new DashboardChartResponse();
        chart.setChartType(type);
        chart.setTitle(title);
        chart.setXAxis(new ArrayList<>(counts.keySet()));
        chart.setSeries(List.of(series(seriesName, new ArrayList<>(counts.values()))));
        return chart;
    }

    private DashboardChartResponse.SeriesItem series(String name, List<? extends Number> data) {
        DashboardChartResponse.SeriesItem series = new DashboardChartResponse.SeriesItem();
        series.setName(name);
        series.setData(data);
        return series;
    }

    private Map<String, Long> toCountMap(List<LabelCount> values) {
        Map<String, Long> counts = new LinkedHashMap<>();
        values.forEach(value -> counts.put(
                value.getLabel() == null || value.getLabel().isBlank() ? "unknown" : value.getLabel(),
                value.getCount()));
        return counts;
    }
}
