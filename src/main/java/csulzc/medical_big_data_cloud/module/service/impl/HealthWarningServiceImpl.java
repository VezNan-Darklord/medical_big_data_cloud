package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.common.util.SecurityUtil;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningAssignRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningHandleRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningQueryRequest;
import csulzc.medical_big_data_cloud.module.dto.response.warning.HealthWarningResponse;
import csulzc.medical_big_data_cloud.module.entity.HealthWarning;
import csulzc.medical_big_data_cloud.module.entity.User;
import csulzc.medical_big_data_cloud.module.mapper.HealthWarningMapper;
import csulzc.medical_big_data_cloud.module.repository.ElderlyProfileRepository;
import csulzc.medical_big_data_cloud.module.repository.HealthWarningRepository;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import csulzc.medical_big_data_cloud.module.service.HealthWarningService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
    private final ElderlyProfileRepository elderlyProfileRepository;
    private final UserRepository userRepository;
    private final HealthWarningMapper healthWarningMapper;

    @Override
    @Transactional
    public HealthWarningResponse create(HealthWarningCreateRequest request) {
        if (isElderlyUser()) {
            request.setElderlyId(currentElderlyProfileId());
        } else {
            requireElderly(request.getElderlyId());
        }
        HealthWarning entity = healthWarningMapper.toEntity(request);
        if (!StringUtils.hasText(entity.getStatus())) {
            entity.setStatus("unprocessed");
        }
        return healthWarningMapper.toResponse(healthWarningRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public HealthWarningResponse getById(String id) {
        HealthWarning warning = findEntity(id);
        if (isElderlyUser()) {
            requireOwnProfile(warning.getElderlyId());
        }
        return healthWarningMapper.toResponse(warning);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<HealthWarningResponse> list(HealthWarningQueryRequest request) {
        if (isElderlyUser()) {
            request.setElderlyId(currentElderlyProfileId());
        }
        if (request.getStartTime() != null && request.getEndTime() != null
                && request.getStartTime().isAfter(request.getEndTime())) {
            throw new BusinessException(ResultCode.BAD_REQUEST, "开始时间不能晚于结束时间");
        }
        Page<HealthWarning> page = healthWarningRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            addEqual(predicates, cb, root, "elderlyId", request.getElderlyId());
            addEqual(predicates, cb, root, "warningType", request.getWarningType());
            addEqual(predicates, cb, root, "severity", request.getSeverity());
            addEqual(predicates, cb, root, "status", request.getStatus());
            addEqual(predicates, cb, root, "source", request.getSource());
            if (request.getStartTime() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("occurredAt"), request.getStartTime()));
            }
            if (request.getEndTime() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("occurredAt"), request.getEndTime()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        }, PageRequest.of(request.getPageNo() - 1, request.getPageSize(),
                Sort.by(Sort.Direction.DESC, "occurredAt")));
        return new PageResult<>(page.getContent().stream().map(healthWarningMapper::toResponse).toList(),
                request.getPageNo(), request.getPageSize(), page.getTotalElements());
    }

    @Override
    @Transactional
    public HealthWarningResponse handle(String id, HealthWarningHandleRequest request) {
        HealthWarning warning = findEntity(id);
        requireOpenWarning(warning);
        User handler = StringUtils.hasText(request.getHandlerId())
                ? requireEnabledDoctor(request.getHandlerId())
                : requireEnabledCurrentHandler();
        healthWarningMapper.updateFromHandleRequest(request, warning);
        warning.setHandlerId(handler.getId());
        warning.setHandlerName(handler.getRealName());
        if ("processed".equals(request.getStatus()) || "closed".equals(request.getStatus())) {
            warning.setHandledAt(LocalDateTime.now());
        }
        return healthWarningMapper.toResponse(healthWarningRepository.save(warning));
    }

    @Override
    @Transactional
    public HealthWarningResponse assign(String id, HealthWarningAssignRequest request) {
        HealthWarning warning = findEntity(id);
        requireOpenWarning(warning);
        User handler = requireEnabledDoctor(request.getHandlerId());
        warning.setHandlerId(handler.getId());
        warning.setHandlerName(handler.getRealName());
        warning.setStatus("processing");
        if (StringUtils.hasText(request.getRemark())) {
            warning.setRemark(request.getRemark());
        }
        return healthWarningMapper.toResponse(healthWarningRepository.save(warning));
    }

    @Override
    @Transactional
    public void delete(String id) {
        healthWarningRepository.delete(findEntity(id));
    }

    private HealthWarning findEntity(String id) {
        return healthWarningRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND, "健康预警不存在"));
    }

    private void requireOpenWarning(HealthWarning warning) {
        if ("closed".equals(warning.getStatus())) {
            throw new BusinessException(ResultCode.CONFLICT, "已关闭的预警不能再次处理");
        }
    }

    private User requireEnabledDoctor(String userId) {
        return userRepository.findById(userId)
                .filter(user -> "doctor".equals(user.getRoleCode()) && "enabled".equals(user.getStatus()))
                .orElseThrow(() -> new BusinessException(ResultCode.BAD_REQUEST, "目标医生不存在或不可用"));
    }

    private User requireEnabledCurrentHandler() {
        return userRepository.findById(SecurityUtil.getCurrentUserId())
                .filter(user -> "enabled".equals(user.getStatus()))
                .orElseThrow(() -> new BusinessException(ResultCode.BAD_REQUEST, "当前处理人账户不存在或不可用"));
    }

    private void requireElderly(String id) {
        if (!StringUtils.hasText(id) || !elderlyProfileRepository.existsById(id)) {
            throw new BusinessException(ResultCode.BAD_REQUEST, "老人档案不存在");
        }
    }

    private void requireOwnProfile(String elderlyId) {
        if (!currentElderlyProfileId().equals(elderlyId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "只能访问本人健康预警");
        }
    }

    private String currentElderlyProfileId() {
        return elderlyProfileRepository.findByUserId(SecurityUtil.getCurrentUserId())
                .map(profile -> profile.getId())
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND, "当前账号尚未关联老人档案"));
    }

    private boolean isElderlyUser() {
        return "elderly".equals(SecurityUtil.getCurrentRoleCode());
    }

    private void addEqual(List<Predicate> predicates, jakarta.persistence.criteria.CriteriaBuilder cb,
                          jakarta.persistence.criteria.Root<HealthWarning> root, String field, String value) {
        if (StringUtils.hasText(value)) {
            predicates.add(cb.equal(root.get(field), value));
        }
    }
}
