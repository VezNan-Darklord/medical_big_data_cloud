package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.report.AssessmentReportCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.report.AssessmentReportResponse;
import csulzc.medical_big_data_cloud.module.entity.AssessmentReport;
import csulzc.medical_big_data_cloud.module.mapper.AssessmentReportMapper;
import csulzc.medical_big_data_cloud.module.repository.AssessmentReportRepository;
import csulzc.medical_big_data_cloud.module.service.AssessmentReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AssessmentReportServiceImpl implements AssessmentReportService {

    private final AssessmentReportRepository assessmentReportRepository;
    private final AssessmentReportMapper assessmentReportMapper;

    @Override
    @Transactional
    public AssessmentReportResponse create(AssessmentReportCreateRequest request) {
        AssessmentReport entity = assessmentReportMapper.toEntity(request);
        AssessmentReport saved = assessmentReportRepository.save(entity);
        return assessmentReportMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public AssessmentReportResponse getById(String id) {
        AssessmentReport entity = assessmentReportRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        return assessmentReportMapper.toResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<AssessmentReportResponse> listByElderlyId(String elderlyId, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(Math.max(pageNo - 1, 0), pageSize, Sort.by(Sort.Direction.DESC, "assessedAt"));
        Page<AssessmentReport> page = assessmentReportRepository.findByElderlyId(elderlyId, pageable);
        return new PageResult<>(
                page.getContent().stream().map(assessmentReportMapper::toResponse).toList(),
                pageNo,
                pageSize,
                page.getTotalElements()
        );
    }

    @Override
    @Transactional
    public void delete(String id)
    {
        assessmentReportRepository.deleteById(id);
    }
}
