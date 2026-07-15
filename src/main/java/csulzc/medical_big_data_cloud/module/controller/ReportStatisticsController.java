package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.common.result.FilePayload;
import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardChartResponse;
import csulzc.medical_big_data_cloud.module.dto.response.report.StatisticsOverviewResponse;
import csulzc.medical_big_data_cloud.module.service.ReportStatisticsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/reports/statistics")
@RequiredArgsConstructor
@PreAuthorize("hasRole('admin')")
@Tag(name = "ReportStatistics", description = "报表统计")
public class ReportStatisticsController {

    private final ReportStatisticsService reportStatisticsService;

    @GetMapping("/overview")
    public ApiResponse<StatisticsOverviewResponse> getOverview() {
        return ApiResponse.success(reportStatisticsService.getOverview());
    }

    @GetMapping("/trends")
    public ApiResponse<List<DashboardChartResponse>> getTrends() {
        return ApiResponse.success(reportStatisticsService.getTrends());
    }

    @GetMapping("/distributions")
    public ApiResponse<List<DashboardChartResponse>> getDistributions() {
        return ApiResponse.success(reportStatisticsService.getDistributions());
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> export() {
        FilePayload file = reportStatisticsService.export();
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(file.contentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment()
                                .filename(file.fileName(), StandardCharsets.UTF_8)
                                .build().toString())
                .body(file.content());
    }
}
