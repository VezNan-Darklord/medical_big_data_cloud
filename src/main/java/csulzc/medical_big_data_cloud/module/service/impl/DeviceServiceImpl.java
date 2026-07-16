package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceBindRequest;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceDataReportRequest;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.device.DeviceDataReportResponse;
import csulzc.medical_big_data_cloud.module.dto.response.device.DeviceResponse;
import csulzc.medical_big_data_cloud.module.entity.Device;
import csulzc.medical_big_data_cloud.module.entity.DeviceDataReport;
import csulzc.medical_big_data_cloud.module.entity.User;
import csulzc.medical_big_data_cloud.module.mapper.DeviceMapper;
import csulzc.medical_big_data_cloud.module.repository.DeviceDataReportRepository;
import csulzc.medical_big_data_cloud.module.repository.DeviceRepository;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import csulzc.medical_big_data_cloud.module.service.DeviceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class DeviceServiceImpl implements DeviceService {

    private final DeviceRepository deviceRepository;
    private final DeviceDataReportRepository deviceDataReportRepository;
    private final UserRepository userRepository;
    private final DeviceMapper deviceMapper;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public DeviceResponse create(DeviceCreateRequest request) {
        deviceRepository.findByDeviceSn(request.getDeviceSn()).ifPresent(device -> {
            throw new BusinessException(ResultCode.CONFLICT, "设备序列号已存在");
        });
        Device device = new Device();
        device.setDeviceName(request.getDeviceName());
        device.setDeviceType(request.getDeviceType());
        device.setDeviceSn(request.getDeviceSn());
        device.setFirmwareVersion(request.getFirmwareVersion());
        return deviceMapper.toResponse(deviceRepository.save(device));
    }

    @Override
    @Transactional(readOnly = true)
    public DeviceResponse getById(String id) {
        return enrichElderlyName(deviceMapper.toResponse(findEntity(id)));
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<DeviceResponse> list(String bindingStatus, String onlineStatus, int pageNo, int pageSize) {
        Page<Device> page = deviceRepository.findAll((root, query, cb) -> {
            var predicates = new java.util.ArrayList<jakarta.persistence.criteria.Predicate>();
            if (StringUtils.hasText(bindingStatus)) {
                predicates.add(cb.equal(root.get("bindingStatus"), bindingStatus));
            }
            if (StringUtils.hasText(onlineStatus)) {
                predicates.add(cb.equal(root.get("onlineStatus"), onlineStatus));
            }
            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        }, PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.DESC, "createdAt")));
        List<DeviceResponse> responses = enrichElderlyNames(
                page.getContent().stream().map(deviceMapper::toResponse).toList());
        return new PageResult<>(responses, pageNo, pageSize, page.getTotalElements());
    }

    @Override
    @Transactional
    public DeviceResponse bind(DeviceBindRequest request) {
        Device device = findEntity(request.getDeviceId());
        User user = userRepository.findById(request.getElderlyId())
                .filter(u -> "elderly".equals(u.getRoleCode()) && "enabled".equals(u.getStatus()))
                .orElseThrow(() -> new BusinessException(ResultCode.BAD_REQUEST, "老人账户不存在或不可用"));
        if ("bound".equals(device.getBindingStatus())
                && !request.getElderlyId().equals(device.getElderlyId())) {
            throw new BusinessException(ResultCode.CONFLICT, "设备已绑定其他老人");
        }
        device.setElderlyId(request.getElderlyId());
        device.setBindingStatus("bound");
        DeviceResponse response = deviceMapper.toResponse(deviceRepository.save(device));
        response.setElderlyName(user.getRealName());
        return response;
    }

    @Override
    @Transactional
    public DeviceResponse unbind(String id) {
        Device device = findEntity(id);
        device.setElderlyId(null);
        device.setBindingStatus("unbound");
        return enrichElderlyName(deviceMapper.toResponse(deviceRepository.save(device)));
    }

    @Override
    @Transactional
    public DeviceResponse update(String id, DeviceUpdateRequest request) {
        Device device = findEntity(id);
        deviceMapper.updateEntity(request, device);
        if (StringUtils.hasText(request.getOnlineStatus())) {
            device.setOnlineStatus(request.getOnlineStatus());
        }
        return enrichElderlyName(deviceMapper.toResponse(deviceRepository.save(device)));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeviceDataReportResponse> getReports(String id) {
        findEntity(id);
        return deviceDataReportRepository.findTop100ByDeviceIdOrderByReportedAtDesc(id).stream()
                .map(this::toResponse).toList();
    }

    @Override
    @Transactional
    public DeviceDataReportResponse recordReport(String id, DeviceDataReportRequest request) {
        Device device = findEntity(id);
        DeviceDataReport report = new DeviceDataReport();
        report.setDeviceId(id);
        report.setReportedAt(request.getReportedAt() == null ? LocalDateTime.now() : request.getReportedAt());
        try {
            report.setMetricsJson(objectMapper.writeValueAsString(request.getMetrics()));
        } catch (JacksonException exception) {
            throw new BusinessException(ResultCode.BAD_REQUEST, "上报指标无法序列化");
        }
        device.setOnlineStatus("online");
        device.setLastReportAt(report.getReportedAt());
        deviceRepository.save(device);
        return toResponse(deviceDataReportRepository.save(report));
    }

    @Override
    @Transactional
    public void delete(String id) {
        Device device = findEntity(id);
        if ("bound".equals(device.getBindingStatus())) {
            throw new BusinessException(ResultCode.CONFLICT, "请先解绑设备");
        }
        deviceRepository.delete(device);
    }

    private Device findEntity(String id) {
        return deviceRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND, "设备不存在"));
    }

    private DeviceDataReportResponse toResponse(DeviceDataReport report) {
        DeviceDataReportResponse response = new DeviceDataReportResponse();
        response.setId(report.getId());
        response.setDeviceId(report.getDeviceId());
        response.setReportedAt(report.getReportedAt());
        try {
            response.setMetrics(objectMapper.readValue(report.getMetricsJson(), new TypeReference<>() {
            }));
        } catch (JacksonException exception) {
            throw new BusinessException(ResultCode.INTERNAL_ERROR, "设备上报数据损坏");
        }
        return response;
    }

    private DeviceResponse enrichElderlyName(DeviceResponse response) {
        if (StringUtils.hasText(response.getElderlyId())) {
            userRepository.findById(response.getElderlyId())
                    .ifPresent(user -> response.setElderlyName(user.getRealName()));
        }
        return response;
    }

    private List<DeviceResponse> enrichElderlyNames(List<DeviceResponse> responses) {
        Set<String> ids = responses.stream()
                .map(DeviceResponse::getElderlyId)
                .filter(StringUtils::hasText)
                .collect(Collectors.toSet());
        if (!ids.isEmpty()) {
            Map<String, String> nameMap = userRepository.findAllById(ids).stream()
                    .collect(Collectors.toMap(User::getId, User::getRealName, (a, b) -> a));
            responses.forEach(r -> {
                if (StringUtils.hasText(r.getElderlyId())) {
                    r.setElderlyName(nameMap.get(r.getElderlyId()));
                }
            });
        }
        return responses;
    }
}
