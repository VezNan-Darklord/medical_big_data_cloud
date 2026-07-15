package csulzc.medical_big_data_cloud.module.mapper;

import csulzc.medical_big_data_cloud.module.dto.request.keypop.KeyPopulationCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.keypop.KeyPopulationUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.keypop.KeyPopulationResponse;
import csulzc.medical_big_data_cloud.module.entity.KeyPopulation;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface KeyPopulationMapper {

    KeyPopulationResponse toResponse(KeyPopulation entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    KeyPopulation toEntity(KeyPopulationCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "elderlyId", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntity(KeyPopulationUpdateRequest request, @MappingTarget KeyPopulation entity);
}
