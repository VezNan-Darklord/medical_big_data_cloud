package csulzc.medical_big_data_cloud.module.mapper;

import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningHandleRequest;
import csulzc.medical_big_data_cloud.module.dto.response.warning.HealthWarningResponse;
import csulzc.medical_big_data_cloud.module.entity.HealthWarning;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface HealthWarningMapper {

    HealthWarningResponse toResponse(HealthWarning entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "elderlyId", ignore = true)
    @Mapping(target = "warningType", ignore = true)
    @Mapping(target = "severity", ignore = true)
    @Mapping(target = "source", ignore = true)
    @Mapping(target = "metricName", ignore = true)
    @Mapping(target = "metricValue", ignore = true)
    @Mapping(target = "thresholdValue", ignore = true)
    @Mapping(target = "occurredAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateFromHandleRequest(HealthWarningHandleRequest request, @MappingTarget HealthWarning entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "handledAt", ignore = true)
    @Mapping(target = "handlerId", ignore = true)
    HealthWarning toEntity(HealthWarningCreateRequest request);
}
