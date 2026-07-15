package csulzc.medical_big_data_cloud.module.mapper;

import csulzc.medical_big_data_cloud.module.dto.request.user.ProfileUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.UserCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.UserUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.user.UserResponse;
import csulzc.medical_big_data_cloud.module.entity.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface UserMapper {

    // Entity -> Response（不暴露 passwordHash）
    UserResponse toResponse(User user);

    // CreateRequest -> Entity（password 不映射，由 Service 层加密后设置）
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "tokenVersion", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    User toEntity(UserCreateRequest request);

    // UpdateRequest -> Entity（空值不覆盖，实现部分更新）
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "tokenVersion", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateEntity(UserUpdateRequest request, @MappingTarget User user);

    // ProfileUpdateRequest -> Entity（仅更新展示信息与隐私信息，密码由Service层处理）
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "username", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "roleCode", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "institutionId", ignore = true)
    @Mapping(target = "regionCode", ignore = true)
    @Mapping(target = "lastLoginAt", ignore = true)
    @Mapping(target = "tokenVersion", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "deletedAt", ignore = true)
    void updateProfile(ProfileUpdateRequest request, @MappingTarget User user);
}
