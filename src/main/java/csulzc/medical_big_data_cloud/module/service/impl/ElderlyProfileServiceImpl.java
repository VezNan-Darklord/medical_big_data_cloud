package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileQueryRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.elderly.ElderlyProfileResponse;
import csulzc.medical_big_data_cloud.module.entity.ElderlyProfile;
import csulzc.medical_big_data_cloud.module.mapper.ElderlyProfileMapper;
import csulzc.medical_big_data_cloud.module.repository.ElderlyProfileRepository;
import csulzc.medical_big_data_cloud.module.service.ElderlyProfileService;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ElderlyProfileServiceImpl implements ElderlyProfileService {

    private final ElderlyProfileRepository elderlyProfileRepository;
    private final ElderlyProfileMapper elderlyProfileMapper;

    @Override
    @Transactional
    public ElderlyProfileResponse create(ElderlyProfileCreateRequest request) {
        // 若传入自定义id，校验唯一性
        if (StringUtils.hasText(request.getId()) && elderlyProfileRepository.existsById(request.getId())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "该ID已存在");
        }
        ElderlyProfile entity = elderlyProfileMapper.toEntity(request);
        ElderlyProfile saved = elderlyProfileRepository.save(entity);
        return elderlyProfileMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ElderlyProfileResponse update(String id, ElderlyProfileUpdateRequest request) {
        ElderlyProfile entity = elderlyProfileRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        elderlyProfileMapper.updateEntity(request, entity);
        ElderlyProfile updated = elderlyProfileRepository.save(entity);
        return elderlyProfileMapper.toResponse(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public ElderlyProfileResponse getById(String id) {
        ElderlyProfile entity = elderlyProfileRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        return elderlyProfileMapper.toResponse(entity);
    }

    @Override
    @Transactional
    public void delete(String id) {
        ElderlyProfile entity = elderlyProfileRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        entity.setStatus("deleted");
        elderlyProfileRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<ElderlyProfileResponse> list(ElderlyProfileQueryRequest request) {
        Pageable pageable = PageRequest.of(
                Math.max(request.getPageNo() - 1, 0),
                request.getPageSize(),
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<ElderlyProfile> page = elderlyProfileRepository.findAll((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (StringUtils.hasText(request.getKeyword())) {
                Predicate nameLike = cb.like(cb.lower(root.get("name")), "%" + request.getKeyword().toLowerCase() + "%");
                predicates.add(nameLike);
            }
            if (StringUtils.hasText(request.getGender())) {
                predicates.add(cb.equal(root.get("gender"), request.getGender()));
            }
            if (StringUtils.hasText(request.getCareLevel())) {
                predicates.add(cb.equal(root.get("careLevel"), request.getCareLevel()));
            }
            if (StringUtils.hasText(request.getStatus())) {
                predicates.add(cb.equal(root.get("status"), request.getStatus()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        }, pageable);

        return new PageResult<>(
                page.getContent().stream().map(elderlyProfileMapper::toResponse).toList(),
                request.getPageNo(),
                request.getPageSize(),
                page.getTotalElements()
        );
    }
}
