package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.util.SecurityUtil;
import csulzc.medical_big_data_cloud.module.dto.request.ai.AnalysisRequest;
import csulzc.medical_big_data_cloud.module.dto.response.ai.AnalysisResult;
import csulzc.medical_big_data_cloud.module.dto.response.dashboard.DashboardOverviewResponse;
import csulzc.medical_big_data_cloud.module.entity.AIAnalysis;
import csulzc.medical_big_data_cloud.module.repository.AIAnalysisRepository;
import csulzc.medical_big_data_cloud.module.service.AIAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class AIAnalysisServiceImpl implements AIAnalysisService {

    private final AIAnalysisRepository analysisRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public AnalysisResult analyze(AnalysisRequest request) {
        DashboardOverviewResponse metrics = toOverview(request.metrics());
        List<AnalysisResult.Insight> insights = buildInsights(metrics);
        int maxInsights = request.constraints() == null || request.constraints().maxInsightCount() == null
                ? 5 : request.constraints().maxInsightCount();
        insights = insights.stream().limit(maxInsights).toList();

        List<AnalysisResult.Action> actions = buildActions(metrics);
        List<AnalysisResult.Chart> charts = List.of(
                new AnalysisResult.Chart("line", "健康预警趋势", "warningTrend"),
                new AnalysisResult.Chart("bar", "重点人群分布", "keyPopulationDistribution")
        );
        String summary = buildSummary(metrics);

        AIAnalysis entity = new AIAnalysis();
        entity.setScene(request.scene());
        entity.setTenantId(request.tenantId());
        entity.setRegionCode(request.regionCode());
        entity.setSummary(summary);
        entity.setInsightsJson(writeJson(insights));
        entity.setActionsJson(writeJson(actions));
        entity.setChartsJson(writeJson(charts));
        entity.setCreatedBy(SecurityUtil.getCurrentUserId());
        entity = analysisRepository.save(entity);
        return toResult(entity);
    }

    private DashboardOverviewResponse toOverview(AnalysisRequest.Metrics input) {
        DashboardOverviewResponse metrics = new DashboardOverviewResponse();
        metrics.setTotalElderlyCount(input.elderlyCount());
        metrics.setWarningCount(input.warningCount());
        metrics.setUnhandledWarningCount(input.unhandledWarningCount());
        metrics.setKeyPopulationCount(input.highRiskPopulationCount());
        metrics.setDeviceOnlineRate(input.deviceOnlineRate());
        metrics.setRecentTrend(List.of());
        return metrics;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AnalysisResult> history() {
        return analysisRepository.findByScene("care_decision_analysis",
                        PageRequest.of(0, 100, Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream().map(this::toResult).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AnalysisResult get(String id) {
        return analysisRepository.findById(id)
                .map(this::toResult)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND, "分析记录不存在"));
    }

    private List<AnalysisResult.Insight> buildInsights(DashboardOverviewResponse metrics) {
        List<AnalysisResult.Insight> insights = new ArrayList<>();
        if (metrics.getUnhandledWarningCount() > 0) {
            insights.add(new AnalysisResult.Insight(
                    "risk",
                    "存在未处理健康预警",
                    "当前有 " + metrics.getUnhandledWarningCount() + " 条预警尚未处理。",
                    0.95,
                    "优先按严重程度安排医生复核，并记录处理结果。"
            ));
        } else {
            insights.add(new AnalysisResult.Insight(
                    "trend",
                    "预警处置已闭环",
                    "当前没有未处理健康预警。",
                    0.9,
                    "继续保持日常巡检和随访频率。"
            ));
        }
        if (metrics.getDeviceOnlineRate() < 0.9) {
            insights.add(new AnalysisResult.Insight(
                    "risk",
                    "设备在线率偏低",
                    "当前设备在线率为 " + Math.round(metrics.getDeviceOnlineRate() * 10000) / 100.0 + "%。",
                    0.9,
                    "检查离线设备网络、电量和绑定状态。"
            ));
        }
        if (metrics.getKeyPopulationCount() > 0) {
            insights.add(new AnalysisResult.Insight(
                    "suggestion",
                    "重点人群需要持续随访",
                    "当前有效重点人群数量为 " + metrics.getKeyPopulationCount() + "。",
                    0.88,
                    "按分级和随访周期生成医生待办。"
            ));
        }
        return insights;
    }

    private List<AnalysisResult.Action> buildActions(DashboardOverviewResponse metrics) {
        List<AnalysisResult.Action> actions = new ArrayList<>();
        if (metrics.getUnhandledWarningCount() > 0) {
            actions.add(new AnalysisResult.Action(
                    "review_warnings", "unhandledWarnings", "high", "提高预警处置及时率"));
        }
        if (metrics.getDeviceOnlineRate() < 0.9) {
            actions.add(new AnalysisResult.Action(
                    "inspect_devices", "offlineDevices", "medium", "提高设备在线率"));
        }
        return actions;
    }

    private String buildSummary(DashboardOverviewResponse metrics) {
        if (metrics.getUnhandledWarningCount() > 0 || metrics.getDeviceOnlineRate() < 0.9) {
            return "当前系统运行总体稳定，但预警处置或设备在线率仍需优先关注。";
        }
        return "当前系统运行平稳，预警处置和设备在线情况良好。";
    }

    private AnalysisResult toResult(AIAnalysis entity) {
        return new AnalysisResult(
                entity.getId(),
                entity.getScene(),
                entity.getSummary(),
                readJson(entity.getInsightsJson(), new TypeReference<>() {
                }),
                readJson(entity.getActionsJson(), new TypeReference<>() {
                }),
                readJson(entity.getChartsJson(), new TypeReference<>() {
                }),
                entity.getCreatedAt()
        );
    }

    private String writeJson(Object value) {
        try {
            return objectMapper.writeValueAsString(value);
        } catch (JacksonException exception) {
            throw new BusinessException(ResultCode.INTERNAL_ERROR, "分析结果序列化失败");
        }
    }

    private <T> T readJson(String value, TypeReference<T> type) {
        try {
            return objectMapper.readValue(value, type);
        } catch (JacksonException exception) {
            throw new BusinessException(ResultCode.INTERNAL_ERROR, "分析历史数据损坏");
        }
    }
}
