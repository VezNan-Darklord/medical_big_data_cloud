package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardOverviewResponse;
import csulzc.medical_big_data_cloud.module.service.DashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports/statistics")
@RequiredArgsConstructor
@Tag(name = "Report Statistics", description = "报表统计接口")
public class ReportStatisticsController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    public ApiResponse<DashboardOverviewResponse> getOverview() {
        return ApiResponse.success(dashboardService.getOverview());
    }

    @GetMapping("/trends")
    public ApiResponse<String> getTrends() {
        return ApiResponse.success("趋势数据");
    }

    @GetMapping("/distributions")
    public ApiResponse<String> getDistributions() {
        return ApiResponse.success("分布数据");
    }

    @GetMapping("/export")
    public ApiResponse<String> export() {
        return ApiResponse.success("导出报表");
    }
}
