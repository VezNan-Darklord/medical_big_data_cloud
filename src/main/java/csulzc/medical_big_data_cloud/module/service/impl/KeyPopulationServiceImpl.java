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
import csulzc.medical_big_data_cloud.module.service.KeyPopulationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class KeyPopulationServiceImpl implements KeyPopulationService {

    private final KeyPopulationRepository keyPopulationRepository;
    private final KeyPopulationMapper keyPopulationMapper;

    @Override
    @Transactional
    public KeyPopulationResponse create(KeyPopulationCreateRequest request) {
        KeyPopulation entity = keyPopulationMapper.toEntity(request);
        KeyPopulation saved = keyPopulationRepository.save(entity);
        return keyPopulationMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public KeyPopulationResponse update(String id, KeyPopulationUpdateRequest request) {
        KeyPopulation entity = keyPopulationRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        keyPopulationMapper.updateEntity(request, entity);
        KeyPopulation updated = keyPopulationRepository.save(entity);
        return keyPopulationMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void close(String id) {
        KeyPopulation entity = keyPopulationRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        entity.setStatus("closed");
        keyPopulationRepository.save(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public KeyPopulationResponse getById(String id) {
        KeyPopulation entity = keyPopulationRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        return keyPopulationMapper.toResponse(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<KeyPopulationResponse> list(String status, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(Math.max(pageNo - 1, 0), pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<KeyPopulation> page = StringUtils.hasText(status)
                ? keyPopulationRepository.findByStatus(status, pageable)
                : keyPopulationRepository.findAll(pageable);
        return new PageResult<>(
                page.getContent().stream().map(keyPopulationMapper::toResponse).toList(),
                pageNo,
                pageSize,
                page.getTotalElements()
        );
    }
}
