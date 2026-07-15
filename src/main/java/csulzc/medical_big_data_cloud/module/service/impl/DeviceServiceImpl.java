package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceBindRequest;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.device.DeviceResponse;
import csulzc.medical_big_data_cloud.module.entity.Device;
import csulzc.medical_big_data_cloud.module.mapper.DeviceMapper;
import csulzc.medical_big_data_cloud.module.repository.DeviceRepository;
import csulzc.medical_big_data_cloud.module.service.DeviceService;
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
public class DeviceServiceImpl implements DeviceService {

    private final DeviceRepository deviceRepository;
    private final DeviceMapper deviceMapper;

    @Override
    @Transactional
    public DeviceResponse create(DeviceCreateRequest request) {
        if (deviceRepository.findByDeviceSn(request.getDeviceSn()).isPresent()) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "设备序列号已存在");
        }
        Device device = new Device();
        device.setDeviceName(request.getDeviceName());
        device.setDeviceType(request.getDeviceType());
        device.setDeviceSn(request.getDeviceSn());
        device.setFirmwareVersion(request.getFirmwareVersion());
        device.setBindingStatus("unbound");
        device.setOnlineStatus("offline");
        Device saved = deviceRepository.save(device);
        return deviceMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DeviceResponse getById(String id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        return deviceMapper.toResponse(device);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<DeviceResponse> list(String bindingStatus, String onlineStatus, int pageNo, int pageSize) {
        Pageable pageable = PageRequest.of(Math.max(pageNo - 1, 0), pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Device> page;
        if (StringUtils.hasText(bindingStatus) && StringUtils.hasText(onlineStatus)) {
            page = deviceRepository.findAll((root, query, cb) -> {
                return cb.and(
                        cb.equal(root.get("bindingStatus"), bindingStatus),
                        cb.equal(root.get("onlineStatus"), onlineStatus)
                );
            }, pageable);
        } else if (StringUtils.hasText(bindingStatus)) {
            page = deviceRepository.findByBindingStatus(bindingStatus, pageable);
        } else if (StringUtils.hasText(onlineStatus)) {
            page = deviceRepository.findByOnlineStatus(onlineStatus, pageable);
        } else {
            page = deviceRepository.findAll(pageable);
        }
        return new PageResult<>(
                page.getContent().stream().map(deviceMapper::toResponse).toList(),
                pageNo,
                pageSize,
                page.getTotalElements()
        );
    }

    @Override
    @Transactional
    public void bind(DeviceBindRequest request) {
        Device device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        deviceRepository.updateBinding(device.getId(), request.getElderlyId(), "bound");
    }

    @Override
    @Transactional
    public void unbind(String id) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        deviceRepository.updateBinding(device.getId(), null, "unbound");
    }

    @Override
    @Transactional
    public DeviceResponse update(String id, DeviceUpdateRequest request) {
        Device device = deviceRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        deviceMapper.updateEntity(request, device);
        Device updated = deviceRepository.save(device);
        return deviceMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void delete(String id) {
        deviceRepository.deleteById(id);
    }
}
