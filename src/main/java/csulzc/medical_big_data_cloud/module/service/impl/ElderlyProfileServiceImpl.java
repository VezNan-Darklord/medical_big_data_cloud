package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileQueryRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.device.DeviceResponse;
import csulzc.medical_big_data_cloud.module.dto.response.elderly.ElderlyProfileResponse;
import csulzc.medical_big_data_cloud.module.dto.response.keypop.KeyPopulationResponse;
import csulzc.medical_big_data_cloud.module.dto.response.report.AssessmentReportResponse;
import csulzc.medical_big_data_cloud.module.dto.response.warning.HealthWarningResponse;
import csulzc.medical_big_data_cloud.module.entity.ElderlyProfile;
import csulzc.medical_big_data_cloud.module.mapper.AssessmentReportMapper;
import csulzc.medical_big_data_cloud.module.mapper.DeviceMapper;
import csulzc.medical_big_data_cloud.module.mapper.ElderlyProfileMapper;
import csulzc.medical_big_data_cloud.module.mapper.HealthWarningMapper;
import csulzc.medical_big_data_cloud.module.mapper.KeyPopulationMapper;
import csulzc.medical_big_data_cloud.module.repository.AssessmentReportRepository;
import csulzc.medical_big_data_cloud.module.repository.DeviceRepository;
import csulzc.medical_big_data_cloud.module.repository.ElderlyProfileRepository;
import csulzc.medical_big_data_cloud.module.repository.HealthWarningRepository;
import csulzc.medical_big_data_cloud.module.repository.KeyPopulationRepository;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import csulzc.medical_big_data_cloud.module.service.ElderlyProfileService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ElderlyProfileServiceImpl implements ElderlyProfileService {

    private final ElderlyProfileRepository elderlyProfileRepository;
    private final HealthWarningRepository healthWarningRepository;
    private final AssessmentReportRepository assessmentReportRepository;
    private final DeviceRepository deviceRepository;
    private final KeyPopulationRepository keyPopulationRepository;
    private final UserRepository userRepository;
    private final ElderlyProfileMapper elderlyProfileMapper;
    private final HealthWarningMapper healthWarningMapper;
    private final AssessmentReportMapper assessmentReportMapper;
    private final DeviceMapper deviceMapper;
    private final KeyPopulationMapper keyPopulationMapper;

    @Override
    @Transactional
    public ElderlyProfileResponse create(ElderlyProfileCreateRequest request) {
        if (StringUtils.hasText(request.getId()) && elderlyProfileRepository.existsById(request.getId())) {
            throw new BusinessException(ResultCode.CONFLICT, "档案 ID 已存在");
        }
        validateUserLink(request.getUserId(), null);
        ElderlyProfile entity = elderlyProfileMapper.toEntity(request);
        entity.setAge(resolveAge(request.getBirthday(), request.getAge()));
        if (!StringUtils.hasText(entity.getStatus())) {
            entity.setStatus("active");
        }
        return elderlyProfileMapper.toResponse(elderlyProfileRepository.save(entity));
    }

    @Override
    @Transactional
    public ElderlyProfileResponse update(String id, ElderlyProfileUpdateRequest request) {
        ElderlyProfile entity = findEntity(id);
        validateUserLink(request.getUserId(), id);
        elderlyProfileMapper.updateEntity(request, entity);
        if (request.getBirthday() != null) {
            entity.setAge(resolveAge(request.getBirthday(), request.getAge()));
        }
        return elderlyProfileMapper.toResponse(elderlyProfileRepository.save(entity));
    }

    @Override
    @Transactional(readOnly = true)
    public ElderlyProfileResponse getById(String id) {
        return elderlyProfileMapper.toResponse(findEntity(id));
    }

    @Override
    @Transactional
    public void delete(String id) {
        ElderlyProfile entity = findEntity(id);
        if (!deviceRepository.findByElderlyIdOrderByCreatedAtDesc(id).isEmpty()) {
            throw new BusinessException(ResultCode.CONFLICT, "请先解绑该老人的设备");
        }
        elderlyProfileRepository.delete(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<ElderlyProfileResponse> list(ElderlyProfileQueryRequest request) {
        Page<ElderlyProfile> page = elderlyProfileRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (StringUtils.hasText(request.getKeyword())) {
                String keyword = "%" + request.getKeyword().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), keyword),
                        cb.like(cb.lower(root.get("phone")), keyword)
                ));
            }
            addEqual(predicates, cb, root, "gender", request.getGender());
            addEqual(predicates, cb, root, "careLevel", request.getCareLevel());
            addEqual(predicates, cb, root, "status", request.getStatus());
            addEqual(predicates, cb, root, "regionCode", request.getRegionCode());
            return cb.and(predicates.toArray(new Predicate[0]));
        }, PageRequest.of(request.getPageNo() - 1, request.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")));
        return new PageResult<>(page.getContent().stream().map(elderlyProfileMapper::toResponse).toList(),
                request.getPageNo(), request.getPageSize(), page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public ElderlyProfileResponse getMyProfile(String userId) {
        return elderlyProfileRepository.findByUserId(userId)
                .map(elderlyProfileMapper::toResponse)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND, "当前账号尚未关联老人档案"));
    }

    @Override
    @Transactional(readOnly = true)
    public List<HealthWarningResponse> getWarnings(String id) {
        findEntity(id);
        return healthWarningRepository.findByElderlyIdOrderByOccurredAtDesc(id).stream()
                .map(healthWarningMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AssessmentReportResponse> getReports(String id) {
        findEntity(id);
        return assessmentReportRepository.findByElderlyIdOrderByAssessedAtDesc(id).stream()
                .map(assessmentReportMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeviceResponse> getDevices(String id) {
        findEntity(id);
        return deviceRepository.findByElderlyIdOrderByCreatedAtDesc(id).stream()
                .map(deviceMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<KeyPopulationResponse> getKeyPopulations(String id) {
        findEntity(id);
        return keyPopulationRepository.findByElderlyIdOrderByCreatedAtDesc(id).stream()
                .map(keyPopulationMapper::toResponse).toList();
    }

    private ElderlyProfile findEntity(String id) {
        return elderlyProfileRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND, "老人档案不存在"));
    }

    private void validateUserLink(String userId, String currentProfileId) {
        if (!StringUtils.hasText(userId)) {
            return;
        }
        userRepository.findById(userId)
                .filter(user -> "elderly".equals(user.getRoleCode()))
                .orElseThrow(() -> new BusinessException(ResultCode.BAD_REQUEST, "关联账号不存在或不是老人账号"));
        elderlyProfileRepository.findByUserId(userId)
                .filter(profile -> !profile.getId().equals(currentProfileId))
                .ifPresent(profile -> {
                    throw new BusinessException(ResultCode.CONFLICT, "该账号已关联其他老人档案");
                });
    }

    private Integer resolveAge(LocalDate birthday, Integer suppliedAge) {
        if (birthday == null) {
            return suppliedAge;
        }
        if (birthday.isAfter(LocalDate.now())) {
            throw new BusinessException(ResultCode.BAD_REQUEST, "出生日期不能晚于今天");
        }
        return Period.between(birthday, LocalDate.now()).getYears();
    }

    private void addEqual(List<Predicate> predicates, jakarta.persistence.criteria.CriteriaBuilder cb,
                          jakarta.persistence.criteria.Root<ElderlyProfile> root, String field, String value) {
        if (StringUtils.hasText(value)) {
            predicates.add(cb.equal(root.get(field), value));
        }
    }
}
