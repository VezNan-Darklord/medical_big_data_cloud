package csulzc.medical_big_data_cloud.module.controller;

import csulzc.medical_big_data_cloud.common.result.ApiResponse;
import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardChartResponse;
import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardOverviewResponse;
import csulzc.medical_big_data_cloud.module.service.DashboardService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('admin', 'doctor', 'operator', 'analyst')")
@Tag(name = "Dashboard", description = "首页看板")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/overview")
    public ApiResponse<DashboardOverviewResponse> getOverview() {
        return ApiResponse.success(dashboardService.getOverview());
    }

    @GetMapping("/charts")
    public ApiResponse<List<DashboardChartResponse>> getCharts() {
        return ApiResponse.success(dashboardService.getCharts());
    }
}
