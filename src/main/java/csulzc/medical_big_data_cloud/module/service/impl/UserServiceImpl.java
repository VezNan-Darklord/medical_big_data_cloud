package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.user.*;
import csulzc.medical_big_data_cloud.module.dto.response.user.UserResponse;
import csulzc.medical_big_data_cloud.module.entity.User;
import csulzc.medical_big_data_cloud.module.mapper.UserMapper;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import csulzc.medical_big_data_cloud.module.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse createUser(UserCreateRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "用户名已存在");
        }
        User user = userMapper.toEntity(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(String userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));

        // 1. 手机号唯一性校验（仅在变更时校验）
        if (request.getMobile() != null && !request.getMobile().equals(user.getMobile())) {
            if (userRepository.existsByMobile(request.getMobile())) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "手机号已被其他账号使用");
            }
        }

        // 2. 处理密码修改（oldPassword + newPassword 成对出现时触发）
        if (request.getNewPassword() != null) {
            if (request.getOldPassword() == null) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "修改密码需要提供旧密码");
            }
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
                throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "旧密码不正确");
            }
            user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        }

        // 3. 更新对外展示信息和个人隐私信息（仅覆盖非空字段）
        userMapper.updateProfile(request, user);

        User updated = userRepository.save(user);
        return userMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public UserResponse updateUser(String id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        userMapper.updateEntity(request, user);
        User updated = userRepository.save(user);
        return userMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void updateStatus(String id, UserStatusUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        user.setStatus(request.getStatus());
        userRepository.save(user);
    }


    @Override
    @Transactional
    public void resetPassword(String id, String newPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));
        return userMapper.toResponse(user);
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
        Pageable pageable = PageRequest.of(Math.max(pageNo - 1, 0), pageSize, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> page;
        if (StringUtils.hasText(roleCode) && StringUtils.hasText(status)) {
            page = userRepository.findByRoleCode(roleCode, pageable); // 简化处理，实际可用 Specification
        } else if (StringUtils.hasText(roleCode)) {
            page = userRepository.findByRoleCode(roleCode, pageable);
        } else if (StringUtils.hasText(status)) {
            page = userRepository.findByStatus(status, pageable);
        } else {
            page = userRepository.findAll(pageable);
        }
        return new PageResult<>(
                page.getContent().stream().map(userMapper::toResponse).toList(),
                pageNo,
                pageSize,
                page.getTotalElements()
        );
    }

    @Override
    @Transactional
    public void delete(String id) {
        userRepository.deleteById(id);
    }
}
