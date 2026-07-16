package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.keypop.KeyPopulationCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.keypop.KeyPopulationUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.keypop.KeyPopulationResponse;
import csulzc.medical_big_data_cloud.module.entity.KeyPopulation;
import csulzc.medical_big_data_cloud.module.mapper.KeyPopulationMapper;
import csulzc.medical_big_data_cloud.module.repository.KeyPopulationRepository;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import csulzc.medical_big_data_cloud.module.service.KeyPopulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class KeyPopulationServiceImpl implements KeyPopulationService {

    private final KeyPopulationRepository keyPopulationRepository;
    private final UserRepository userRepository;
    private final KeyPopulationMapper keyPopulationMapper;

    @Override
    @Transactional
    public KeyPopulationResponse create(KeyPopulationCreateRequest request) {
        requireElderlyUser(request.getElderlyId());
        validateDoctor(request.getOwnerDoctorId());
        boolean duplicate = keyPopulationRepository.findByElderlyIdOrderByCreatedAtDesc(request.getElderlyId()).stream()
                .anyMatch(item -> item.getCategory().equals(request.getCategory()) && "active".equals(item.getStatus()));
        if (duplicate) {
            throw new BusinessException(ResultCode.CONFLICT, "该老人已存在相同类别的有效重点人群记录");
        }
        KeyPopulation entity = keyPopulationMapper.toEntity(request);
        if (!StringUtils.hasText(entity.getLevel())) {
            entity.setLevel("C");
        }
        if (entity.getFollowUpCycleDays() == null || entity.getFollowUpCycleDays() < 1) {
            entity.setFollowUpCycleDays(30);
        }
        if (!StringUtils.hasText(entity.getStatus())) {
            entity.setStatus("active");
        }
        return keyPopulationMapper.toResponse(keyPopulationRepository.save(entity));
    }

    @Override
    @Transactional
    public KeyPopulationResponse update(String id, KeyPopulationUpdateRequest request) {
        KeyPopulation entity = findEntity(id);
        validateDoctor(request.getOwnerDoctorId());
        keyPopulationMapper.updateEntity(request, entity);
        if (entity.getFollowUpCycleDays() != null && entity.getFollowUpCycleDays() < 1) {
            throw new BusinessException(ResultCode.BAD_REQUEST, "随访周期必须大于 0");
        }
        return keyPopulationMapper.toResponse(keyPopulationRepository.save(entity));
    }

    @Override
    @Transactional
    public void close(String id) {
        KeyPopulation entity = findEntity(id);
        entity.setStatus("closed");
        keyPopulationRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public KeyPopulationResponse getById(String id) {
        return keyPopulationMapper.toResponse(findEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<KeyPopulationResponse> list(String status, int pageNo, int pageSize) {
        Page<KeyPopulation> page = StringUtils.hasText(status)
                ? keyPopulationRepository.findByStatus(status,
                PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.DESC, "createdAt")))
                : keyPopulationRepository.findAll(
                PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.DESC, "createdAt")));
        return new PageResult<>(page.getContent().stream().map(keyPopulationMapper::toResponse).toList(),
                pageNo, pageSize, page.getTotalElements());
    }

    @Override
    @Transactional
    public void delete(String id) {
        keyPopulationRepository.delete(findEntity(id));
    }

    private KeyPopulation findEntity(String id) {
        return keyPopulationRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND, "重点人群记录不存在"));
    }

    private void requireElderlyUser(String elderlyId) {
        userRepository.findById(elderlyId)
                .filter(user -> "elderly".equals(user.getRoleCode()) && "enabled".equals(user.getStatus()))
                .orElseThrow(() -> new BusinessException(ResultCode.BAD_REQUEST, "老人账户不存在或不可用"));
    }

    private void validateDoctor(String doctorId) {
        if (!StringUtils.hasText(doctorId)) {
            return;
        }
        userRepository.findById(doctorId)
                .filter(user -> "doctor".equals(user.getRoleCode()) && "enabled".equals(user.getStatus()))
                .orElseThrow(() -> new BusinessException(ResultCode.BAD_REQUEST, "负责医生不存在或不可用"));
    }
}
