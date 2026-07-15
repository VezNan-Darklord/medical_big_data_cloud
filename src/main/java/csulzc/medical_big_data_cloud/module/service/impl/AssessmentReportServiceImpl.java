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
import csulzc.medical_big_data_cloud.module.mapper.AssessmentReportMapper;
import csulzc.medical_big_data_cloud.module.repository.AssessmentReportRepository;
import csulzc.medical_big_data_cloud.module.repository.ElderlyProfileRepository;
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
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssessmentReportServiceImpl implements AssessmentReportService {

    private final AssessmentReportRepository assessmentReportRepository;
    private final ElderlyProfileRepository elderlyProfileRepository;
    private final AssessmentReportMapper assessmentReportMapper;

    @Override
    @Transactional
    public AssessmentReportResponse create(AssessmentReportCreateRequest request) {
        elderlyProfileRepository.findById(request.getElderlyId())
                .orElseThrow(() -> new BusinessException(ResultCode.BAD_REQUEST, "老人档案不存在"));

        AssessmentReport entity = assessmentReportMapper.toEntity(request);
        entity.setAssessorId(SecurityUtil.getCurrentUserId());
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
    @Transactional(readOnly = true)
    public PageResult<AssessmentReportResponse> listForElderlyUser(String userId, int pageNo, int pageSize) {
        ElderlyProfile profile = elderlyProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND, "老人账号尚未关联档案"));
        PageRequest pageable = PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.DESC, "assessedAt"));
        Page<AssessmentReport> page = assessmentReportRepository.findByElderlyId(profile.getId(), pageable);
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

    private void appendItems(StringBuilder builder, List<String> values) {
        if (values == null || values.isEmpty()) {
            builder.append("- 无\n");
            return;
        }
        values.forEach(value -> builder.append("- ").append(value).append('\n'));
    }
}
