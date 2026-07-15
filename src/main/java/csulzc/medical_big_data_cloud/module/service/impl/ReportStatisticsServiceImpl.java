package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.result.FilePayload;
import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardChartResponse;
import csulzc.medical_big_data_cloud.module.dto.response.report.StatisticsOverviewResponse;
import csulzc.medical_big_data_cloud.module.repository.DeviceRepository;
import csulzc.medical_big_data_cloud.module.repository.ElderlyProfileRepository;
import csulzc.medical_big_data_cloud.module.repository.HealthWarningRepository;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import csulzc.medical_big_data_cloud.module.service.DashboardService;
import csulzc.medical_big_data_cloud.module.service.ReportStatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ReportStatisticsServiceImpl implements ReportStatisticsService {

    private static final int TREND_MONTHS = 6;
    private static final DateTimeFormatter MONTH_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM");

    private final DashboardService dashboardService;
    private final ElderlyProfileRepository elderlyProfileRepository;
    private final UserRepository userRepository;
    private final DeviceRepository deviceRepository;
    private final HealthWarningRepository healthWarningRepository;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional(readOnly = true)
    public StatisticsOverviewResponse getOverview() {
        long totalDeviceCount = deviceRepository.count();
        long onlineDeviceCount = deviceRepository.countByOnlineStatus("online");

        StatisticsOverviewResponse response = new StatisticsOverviewResponse();
        response.setTotalElderlyCount(elderlyProfileRepository.countByStatus("active"));
        response.setTotalDoctorCount(userRepository.countByRoleCode("doctor"));
        response.setTotalDeviceCount(totalDeviceCount);
        response.setUnboundDeviceCount(deviceRepository.countByBindingStatus("unbound"));
        response.setDeviceOnlineRate(totalDeviceCount == 0 ? 0.0
                : Math.round((double) onlineDeviceCount / totalDeviceCount * 10000.0) / 10000.0);
        response.setTotalWarningCount(healthWarningRepository.count());
        response.setUnhandledWarningCount(
                healthWarningRepository.countByStatusIn(List.of("unprocessed", "processing")));
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<DashboardChartResponse> getTrends() {
        List<YearMonth> months = recentMonths();
        return List.of(
                keyPopulationTrend(months),
                elderlyProfileTrend(months),
                deviceBindingDistribution()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<DashboardChartResponse> getDistributions() {
        return dashboardService.getCharts().stream()
                .filter(chart -> !"line".equals(chart.getChartType()))
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public FilePayload export() {
        StatisticsOverviewResponse overview = getOverview();
        String csv = "\uFEFF指标,数值\n"
                + "在档老人总数," + overview.getTotalElderlyCount() + "\n"
                + "医生总数," + overview.getTotalDoctorCount() + "\n"
                + "设备总数," + overview.getTotalDeviceCount() + "\n"
                + "未关联设备数量," + overview.getUnboundDeviceCount() + "\n"
                + "设备在线率," + overview.getDeviceOnlineRate() + "\n"
                + "预警总数," + overview.getTotalWarningCount() + "\n"
                + "未处理预警数," + overview.getUnhandledWarningCount() + "\n";
        return new FilePayload("statistics-" + LocalDate.now() + ".csv",
                "text/csv;charset=UTF-8", csv.getBytes(StandardCharsets.UTF_8));
    }

    private DashboardChartResponse keyPopulationTrend(List<YearMonth> months) {
        LocalDateTime endExclusive = monthEndExclusive(months.get(months.size() - 1));
        List<LifecycleRow> rows = jdbcTemplate.query("""
                        SELECT category, created_at, updated_at, status, deleted_at
                        FROM key_population
                        WHERE created_at < ?
                        """,
                statement -> statement.setTimestamp(1, Timestamp.valueOf(endExclusive)),
                (resultSet, rowNumber) -> new LifecycleRow(
                        resultSet.getString("category"),
                        resultSet.getTimestamp("created_at").toLocalDateTime(),
                        resultSet.getTimestamp("updated_at").toLocalDateTime(),
                        resultSet.getString("status"),
                        toLocalDateTime(resultSet.getTimestamp("deleted_at"))
                ));

        Set<String> categories = new LinkedHashSet<>();
        rows.stream().map(LifecycleRow::label).filter(label -> label != null && !label.isBlank())
                .sorted().forEach(categories::add);

        List<DashboardChartResponse.SeriesItem> series = categories.stream()
                .map(category -> series(category, months.stream()
                        .map(month -> rows.stream()
                                .filter(row -> category.equals(row.label()))
                                .filter(row -> isActiveAt(row, monthEndExclusive(month)))
                                .count())
                        .toList()))
                .toList();
        return chart("line", "重点人群变化趋势", monthLabels(months), series);
    }

    private DashboardChartResponse elderlyProfileTrend(List<YearMonth> months) {
        LocalDateTime endExclusive = monthEndExclusive(months.get(months.size() - 1));
        List<LifecycleRow> rows = jdbcTemplate.query("""
                        SELECT created_at, updated_at, status, deleted_at
                        FROM elderly_profile
                        WHERE created_at < ?
                        """,
                statement -> statement.setTimestamp(1, Timestamp.valueOf(endExclusive)),
                (resultSet, rowNumber) -> new LifecycleRow(
                        null,
                        resultSet.getTimestamp("created_at").toLocalDateTime(),
                        resultSet.getTimestamp("updated_at").toLocalDateTime(),
                        resultSet.getString("status"),
                        toLocalDateTime(resultSet.getTimestamp("deleted_at"))
                ));

        List<Long> created = months.stream()
                .map(month -> rows.stream().filter(row -> isInMonth(row.createdAt(), month)).count())
                .toList();
        List<Long> retired = months.stream()
                .map(month -> rows.stream().filter(row -> retiredInMonth(row, month)).count())
                .toList();
        List<Long> active = months.stream()
                .map(month -> rows.stream().filter(row -> isActiveAt(row, monthEndExclusive(month))).count())
                .toList();

        return chart("line", "老人档案变化趋势", monthLabels(months), List.of(
                series("新增建档", created),
                series("注销档案", retired),
                series("在档总数", active)
        ));
    }

    private DashboardChartResponse deviceBindingDistribution() {
        long bound = deviceRepository.countByBindingStatus("bound");
        long unbound = deviceRepository.countByBindingStatus("unbound");
        return chart("pie", "未关联设备数量统计", List.of("已关联", "未关联"),
                List.of(series("设备数量", List.of(bound, unbound))));
    }

    private boolean isActiveAt(LifecycleRow row, LocalDateTime endExclusive) {
        if (!row.createdAt().isBefore(endExclusive)) {
            return false;
        }
        if (row.deletedAt() != null && row.deletedAt().isBefore(endExclusive)) {
            return false;
        }
        boolean currentlyInactive = "closed".equals(row.status()) || "inactive".equals(row.status());
        return !currentlyInactive || row.updatedAt() == null || !row.updatedAt().isBefore(endExclusive);
    }

    private boolean retiredInMonth(LifecycleRow row, YearMonth month) {
        if (isInMonth(row.deletedAt(), month)) {
            return true;
        }
        return "inactive".equals(row.status()) && isInMonth(row.updatedAt(), month);
    }

    private boolean isInMonth(LocalDateTime value, YearMonth month) {
        return value != null && YearMonth.from(value).equals(month);
    }

    private List<YearMonth> recentMonths() {
        YearMonth firstMonth = YearMonth.now().minusMonths(TREND_MONTHS - 1L);
        List<YearMonth> months = new ArrayList<>();
        for (int index = 0; index < TREND_MONTHS; index++) {
            months.add(firstMonth.plusMonths(index));
        }
        return months;
    }

    private List<String> monthLabels(List<YearMonth> months) {
        return months.stream().map(month -> month.format(MONTH_FORMATTER)).toList();
    }

    private LocalDateTime monthEndExclusive(YearMonth month) {
        return month.plusMonths(1).atDay(1).atStartOfDay();
    }

    private DashboardChartResponse chart(String type, String title, List<String> xAxis,
                                         List<DashboardChartResponse.SeriesItem> series) {
        DashboardChartResponse chart = new DashboardChartResponse();
        chart.setChartType(type);
        chart.setTitle(title);
        chart.setXAxis(xAxis);
        chart.setSeries(series);
        return chart;
    }

    private DashboardChartResponse.SeriesItem series(String name, List<? extends Number> data) {
        DashboardChartResponse.SeriesItem series = new DashboardChartResponse.SeriesItem();
        series.setName(name);
        series.setData(data);
        return series;
    }

    private LocalDateTime toLocalDateTime(Timestamp timestamp) {
        return timestamp == null ? null : timestamp.toLocalDateTime();
    }

    private record LifecycleRow(
            String label,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            String status,
            LocalDateTime deletedAt
    ) {
    }
}
