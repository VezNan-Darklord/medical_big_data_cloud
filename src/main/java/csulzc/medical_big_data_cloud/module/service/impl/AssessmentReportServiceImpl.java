package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.result.FilePayload;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.common.util.SecurityUtil;
import csulzc.medical_big_data_cloud.module.dto.request.report.AssessmentReportCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.report.AssessmentReportReviewRequest;
import csulzc.medical_big_data_cloud.module.dto.response.report.AssessmentReportResponse;
import csulzc.medical_big_data_cloud.module.entity.AssessmentReport;
import csulzc.medical_big_data_cloud.module.entity.ElderlyProfile;
import csulzc.medical_big_data_cloud.module.entity.HealthWarning;
import csulzc.medical_big_data_cloud.module.mapper.AssessmentReportMapper;
import csulzc.medical_big_data_cloud.module.repository.AssessmentReportRepository;
import csulzc.medical_big_data_cloud.module.repository.ElderlyProfileRepository;
import csulzc.medical_big_data_cloud.module.repository.HealthWarningRepository;
import csulzc.medical_big_data_cloud.module.service.AssessmentReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AssessmentReportServiceImpl implements AssessmentReportService {

    private final AssessmentReportRepository assessmentReportRepository;
    private final ElderlyProfileRepository elderlyProfileRepository;
    private final HealthWarningRepository healthWarningRepository;
    private final AssessmentReportMapper assessmentReportMapper;

    @Override
    @Transactional
    public AssessmentReportResponse create(AssessmentReportCreateRequest request) {
        ElderlyProfile elderly = elderlyProfileRepository.findById(request.getElderlyId())
                .orElseThrow(() -> new BusinessException(ResultCode.BAD_REQUEST, "老人档案不存在"));
        List<HealthWarning> activeWarnings = healthWarningRepository
                .findByElderlyIdOrderByOccurredAtDesc(request.getElderlyId()).stream()
                .filter(warning -> !"closed".equals(warning.getStatus()) && !"processed".equals(warning.getStatus()))
                .toList();

        AssessmentReport entity = assessmentReportMapper.toEntity(request);
        int score = request.getScore() == null ? calculateScore(activeWarnings) : request.getScore();
        entity.setScore(score);
        entity.setGrade(StringUtils.hasText(request.getGrade()) ? request.getGrade() : gradeFor(score));
        entity.setRiskItems(hasContent(request.getRiskItems())
                ? request.getRiskItems() : buildRiskItems(activeWarnings));
        entity.setRecommendations(hasContent(request.getRecommendations())
                ? request.getRecommendations() : buildRecommendations(activeWarnings));
        entity.setSummary(StringUtils.hasText(request.getSummary())
                ? request.getSummary() : buildSummary(elderly, score, entity.getRiskItems()));
        entity.setAssessorId(StringUtils.hasText(request.getAssessorId())
                ? request.getAssessorId() : SecurityUtil.getCurrentUserId());
        entity.setAssessedAt(request.getAssessedAt() == null ? LocalDateTime.now() : request.getAssessedAt());
        entity.setReviewStatus("draft");
        return assessmentReportMapper.toResponse(assessmentReportRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public AssessmentReportResponse getById(String id) {
        return assessmentReportMapper.toResponse(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<AssessmentReportResponse> list(String elderlyId, int pageNo, int pageSize) {
        PageRequest pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.DESC, "assessedAt"));
        Page<AssessmentReport> page = StringUtils.hasText(elderlyId)
                ? assessmentReportRepository.findByElderlyId(elderlyId, pageable)
                : assessmentReportRepository.findAll(pageable);
        return new PageResult<>(page.getContent().stream().map(assessmentReportMapper::toResponse).toList(),
                pageNo, pageSize, page.getTotalElements());
    }

    @Override
    @Transactional
    public AssessmentReportResponse review(String id, AssessmentReportReviewRequest request) {
        AssessmentReport report = findEntity(id);
        report.setReviewStatus(request.getReviewStatus());
        report.setReviewerId(SecurityUtil.getCurrentUserId());
        report.setReviewedAt(LocalDateTime.now());
        return assessmentReportMapper.toResponse(assessmentReportRepository.save(report));
    }

    @Override
    @Transactional(readOnly = true)
    public FilePayload export(String id) {
        AssessmentReport report = findEntity(id);
        ElderlyProfile elderly = elderlyProfileRepository.findById(report.getElderlyId())
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND, "关联老人档案不存在"));
        StringBuilder markdown = new StringBuilder()
                .append("# 健康评估报告\n\n")
                .append("- 报告编号：").append(report.getId()).append('\n')
                .append("- 老人姓名：").append(elderly.getName()).append('\n')
                .append("- 报告类型：").append(report.getReportType()).append('\n')
                .append("- 评估时间：").append(report.getAssessedAt()
                        .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append('\n')
                .append("- 评分：").append(report.getScore()).append('\n')
                .append("- 等级：").append(report.getGrade()).append('\n')
                .append("- 复核状态：").append(report.getReviewStatus()).append("\n\n")
                .append("## 评估摘要\n\n").append(report.getSummary()).append("\n\n")
                .append("## 风险项\n\n");
        appendItems(markdown, report.getRiskItems());
        markdown.append("\n## 建议\n\n");
        appendItems(markdown, report.getRecommendations());
        return new FilePayload("assessment-report-" + report.getId() + ".md",
                "text/markdown;charset=UTF-8", markdown.toString().getBytes(StandardCharsets.UTF_8));
    }

    @Override
    @Transactional
    public void delete(String id) {
        assessmentReportRepository.delete(findEntity(id));
    }

    private AssessmentReport findEntity(String id) {
        return assessmentReportRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND, "评估报告不存在"));
    }

    private int calculateScore(List<HealthWarning> warnings) {
        int deductions = warnings.stream().mapToInt(warning -> switch (warning.getSeverity()) {
            case "critical" -> 20;
            case "high" -> 12;
            case "medium" -> 6;
            default -> 2;
        }).sum();
        return Math.max(0, 100 - deductions);
    }

    private String gradeFor(int score) {
        if (score >= 90) return "A";
        if (score >= 75) return "B";
        if (score >= 60) return "C";
        return "D";
    }

    private List<String> buildRiskItems(List<HealthWarning> warnings) {
        return warnings.stream()
                .map(warning -> warning.getWarningType() + "（" + warning.getSeverity() + "）")
                .distinct()
                .limit(10)
                .toList();
    }

    private List<String> buildRecommendations(List<HealthWarning> warnings) {
        Set<String> recommendations = new LinkedHashSet<>();
        for (HealthWarning warning : warnings) {
            switch (warning.getSeverity()) {
                case "critical" -> recommendations.add("立即安排医生复核并联系家属");
                case "high" -> recommendations.add("24 小时内完成复测和随访");
                case "medium" -> recommendations.add("加强相关指标监测并记录变化");
                default -> recommendations.add("维持常规监测");
            }
        }
        if (recommendations.isEmpty()) {
            recommendations.add("维持常规健康监测与定期评估");
        }
        return new ArrayList<>(recommendations);
    }

    private String buildSummary(ElderlyProfile elderly, int score, List<String> risks) {
        if (risks.isEmpty()) {
            return elderly.getName() + "当前整体健康风险较低，建议继续保持常规监测。";
        }
        return elderly.getName() + "本次评估得分 " + score + "，发现 " + risks.size()
                + " 项需关注风险，请按建议安排复核和随访。";
    }

    private boolean hasContent(List<String> values) {
        return values != null && !values.isEmpty();
    }

    private void appendItems(StringBuilder builder, List<String> values) {
        if (values == null || values.isEmpty()) {
            builder.append("- 无\n");
            return;
        }
        values.forEach(value -> builder.append("- ").append(value).append('\n'));
    }
}
