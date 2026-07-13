package csulzc.medical_big_data_cloud.module.mapper;

import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.elderly.ElderlyProfileResponse;
import csulzc.medical_big_data_cloud.module.entity.ElderlyProfile;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface ElderlyProfileMapper {

    ElderlyProfileResponse toResponse(ElderlyProfile entity);

    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ElderlyProfile toEntity(ElderlyProfileCreateRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntity(ElderlyProfileUpdateRequest request, @MappingTarget ElderlyProfile entity);
}
