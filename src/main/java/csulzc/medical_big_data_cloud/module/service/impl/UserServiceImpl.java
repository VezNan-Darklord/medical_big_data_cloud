package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.user.ChangePasswordRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.ProfileUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.UserCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.UserStatusUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.user.UserUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.user.UserResponse;
import csulzc.medical_big_data_cloud.module.dto.response.user.TodoResponse;
import csulzc.medical_big_data_cloud.module.entity.HealthWarning;
import csulzc.medical_big_data_cloud.module.entity.User;
import csulzc.medical_big_data_cloud.module.mapper.UserMapper;
import csulzc.medical_big_data_cloud.module.repository.RefreshTokenRepository;
import csulzc.medical_big_data_cloud.module.repository.HealthWarningRepository;
import csulzc.medical_big_data_cloud.module.repository.RoleRepository;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import csulzc.medical_big_data_cloud.module.repository.specification.UserSpecification;
import csulzc.medical_big_data_cloud.module.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final HealthWarningRepository healthWarningRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        checkUniqueIdentity(request.getUsername(), request.getMobile(), null);
        validateRole(request.getRoleCode());
        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(StringUtils.hasText(request.getStatus()) ? request.getStatus() : "enabled");
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateProfile(String userId, ProfileUpdateRequest request) {
        User user = findUser(userId);
        if (StringUtils.hasText(request.getMobile()) && !request.getMobile().equals(user.getMobile())) {
            checkUniqueIdentity(user.getUsername(), request.getMobile(), userId);
        }
        userMapper.updateProfile(request, user);
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = findUser(id);
        if (StringUtils.hasText(request.getMobile()) && !request.getMobile().equals(user.getMobile())) {
            checkUniqueIdentity(user.getUsername(), request.getMobile(), id);
        }
        if (StringUtils.hasText(request.getRoleCode())) {
            validateRole(request.getRoleCode());
        }
        boolean invalidateTokens = (StringUtils.hasText(request.getRoleCode()) && !request.getRoleCode().equals(user.getRoleCode()))
                || (StringUtils.hasText(request.getStatus()) && !request.getStatus().equals(user.getStatus()));
        userMapper.updateEntity(request, user);
        if (invalidateTokens) {
            invalidateTokens(user);
        }
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void updateStatus(String id, UserStatusUpdateRequest request) {
        User user = findUser(id);
        if (!request.getStatus().equals(user.getStatus())) {
            user.setStatus(request.getStatus());
            invalidateTokens(user);
            userRepository.save(user);
        }
    }

    @Override
    @Transactional
    public void resetPassword(String id, String newPassword) {
        User user = findUser(id);
        updatePassword(user, newPassword);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void changePassword(String id, ChangePasswordRequest request) {
        User user = findUser(id);
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new BusinessException(ResultCode.BAD_REQUEST, "旧密码不正确");
        }
        updatePassword(user, request.getNewPassword());
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void assignRole(String id, String roleCode) {
        validateRole(roleCode);
        User user = findUser(id);
        if (!roleCode.equals(user.getRoleCode())) {
            user.setRoleCode(roleCode);
            invalidateTokens(user);
            userRepository.save(user);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(String id) {
        return userMapper.toResponse(findUser(id));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        return userMapper.toResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResult<UserResponse> listUsers(String keyword, String roleCode, String status, int pageNo, int pageSize) {
        Page<User> page = userRepository.findAll(
                UserSpecification.search(keyword, roleCode, status),
                PageRequest.of(pageNo - 1, pageSize, Sort.by(Sort.Direction.DESC, "createdAt"))
        );
        return new PageResult<>(page.getContent().stream().map(userMapper::toResponse).toList(),
                pageNo, pageSize, page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public List<TodoResponse> getTodos(String userId) {
        User user = findUser(userId);
        if (!"doctor".equals(user.getRoleCode())) {
            return List.of();
        }
        return healthWarningRepository
                .findByHandlerIdAndStatusInOrderByOccurredAtDesc(userId, List.of("unprocessed", "processing"))
                .stream()
                .map(warning -> new TodoResponse(
                        warning.getId(),
                        "health_warning",
                        "处理健康预警：" + warning.getWarningType(),
                        warning.getSeverity(),
                        warning.getOccurredAt()
                ))
                .toList();
    }

    @Override
    @Transactional
    public void delete(String id) {
        User user = findUser(id);
        invalidateTokens(user);
        userRepository.save(user);
        userRepository.delete(user);
    }

    private User findUser(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
    }

    private void validateRole(String roleCode) {
        if (!StringUtils.hasText(roleCode)) {
            throw new BusinessException(ResultCode.BAD_REQUEST, "角色编码不能为空");
        }
        roleRepository.findByRoleCodeAndStatus(roleCode, "enabled")
                .orElseThrow(() -> new BusinessException(ResultCode.BAD_REQUEST, "角色不存在或已禁用"));
    }

    private void checkUniqueIdentity(String username, String mobile, String excludedId) {
        userRepository.findByUsername(username)
                .filter(user -> !user.getId().equals(excludedId))
                .ifPresent(user -> {
                    throw new BusinessException(ResultCode.CONFLICT, "用户名已存在");
                });
        if (StringUtils.hasText(mobile)) {
            userRepository.findByMobile(mobile)
                    .filter(user -> !user.getId().equals(excludedId))
                    .ifPresent(user -> {
                        throw new BusinessException(ResultCode.CONFLICT, "手机号已被使用");
                    });
        }
    }

    private void updatePassword(User user, String password) {
        user.setPasswordHash(passwordEncoder.encode(password));
        invalidateTokens(user);
    }

    private void invalidateTokens(User user) {
        user.setTokenVersion(user.getTokenVersion() + 1);
        refreshTokenRepository.findByUserIdAndRevokedAtIsNull(user.getId()).forEach(token -> {
            token.setRevokedAt(LocalDateTime.now());
            refreshTokenRepository.save(token);
        });
    }
}
