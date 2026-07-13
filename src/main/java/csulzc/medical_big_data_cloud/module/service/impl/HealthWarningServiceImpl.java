package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningHandleRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningQueryRequest;
import csulzc.medical_big_data_cloud.module.dto.response.warning.HealthWarningResponse;
import csulzc.medical_big_data_cloud.module.entity.HealthWarning;
import csulzc.medical_big_data_cloud.module.mapper.HealthWarningMapper;
import csulzc.medical_big_data_cloud.module.repository.HealthWarningRepository;
import csulzc.medical_big_data_cloud.module.service.HealthWarningService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthWarningServiceImpl implements HealthWarningService {

    private final HealthWarningRepository healthWarningRepository;
    private final HealthWarningMapper healthWarningMapper;
    @Transactional
    @Override
    public HealthWarningResponse create(HealthWarningCreateRequest request) {
        HealthWarning entity = healthWarningMapper.toEntity(request);
        HealthWarning saved = healthWarningRepository.save(entity);
        return healthWarningMapper.toResponse(saved);
    }


    @Override
    @Transactional(readOnly = true)
    public HealthWarningResponse getById(String id) {
        HealthWarning warning = healthWarningRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        return healthWarningMapper.toResponse(warning);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<HealthWarningResponse> list(HealthWarningQueryRequest request) {
        Pageable pageable = PageRequest.of(
                Math.max(request.getPageNo() - 1, 0),
                request.getPageSize(),
                Sort.by(Sort.Direction.DESC, "occurredAt")
        );

        Page<HealthWarning> page = healthWarningRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (StringUtils.hasText(request.getElderlyId())) {
                predicates.add(cb.equal(root.get("elderlyId"), request.getElderlyId()));
            }
            if (StringUtils.hasText(request.getWarningType())) {
                predicates.add(cb.equal(root.get("warningType"), request.getWarningType()));
            }
            if (StringUtils.hasText(request.getSeverity())) {
                predicates.add(cb.equal(root.get("severity"), request.getSeverity()));
            }
            if (StringUtils.hasText(request.getStatus())) {
                predicates.add(cb.equal(root.get("status"), request.getStatus()));
            }
            if (StringUtils.hasText(request.getSource())) {
                predicates.add(cb.equal(root.get("source"), request.getSource()));
            }
            if (request.getStartTime() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("occurredAt"), request.getStartTime()));
            }
            if (request.getEndTime() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("occurredAt"), request.getEndTime()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);

        return new PageResult<>(
                page.getContent().stream().map(healthWarningMapper::toResponse).toList(),
                request.getPageNo(),
                request.getPageSize(),
                page.getTotalElements()
        );
    }

    @Override
    @Transactional
    public void handle(String id, HealthWarningHandleRequest request) {
        HealthWarning warning = healthWarningRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        healthWarningMapper.updateFromHandleRequest(request, warning);
        warning.setHandledAt(LocalDateTime.now());
        healthWarningRepository.save(warning);
    }
}
