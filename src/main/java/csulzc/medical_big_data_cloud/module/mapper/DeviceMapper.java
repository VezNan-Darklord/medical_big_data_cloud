package csulzc.medical_big_data_cloud.module.mapper;

import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.device.DeviceResponse;
import csulzc.medical_big_data_cloud.module.entity.Device;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface DeviceMapper {

    DeviceResponse toResponse(Device entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "deviceSn", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(DeviceUpdateRequest request, @MappingTarget Device entity);
}
