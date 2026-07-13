package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.config.security.CustomUserDetails;
import csulzc.medical_big_data_cloud.config.security.JwtUtil;
import csulzc.medical_big_data_cloud.module.dto.request.auth.LoginRequest;
import csulzc.medical_big_data_cloud.module.dto.request.auth.RegisterRequest;
import csulzc.medical_big_data_cloud.module.dto.response.auth.LoginResponse;
import csulzc.medical_big_data_cloud.module.dto.response.user.UserResponse;
import csulzc.medical_big_data_cloud.module.entity.User;
import csulzc.medical_big_data_cloud.module.mapper.UserMapper;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import csulzc.medical_big_data_cloud.module.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "用户名已存在");
        }
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new BusinessException(ResultCode.BAD_REQUEST.getCode(), "手机号已注册");
        }

        String roleCode = request.getRoleCode();

        // 权限控制：未登录用户只能注册 elderly；已登录的管理员可以注册任意角色
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        boolean isAnonymous = authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal());
        boolean isAdmin = !isAnonymous && authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_admin"));

        if (isAnonymous && !"elderly".equals(roleCode)) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "无权限注册该角色");
        }
        if (!isAnonymous && !isAdmin) {
            throw new BusinessException(ResultCode.FORBIDDEN.getCode(), "无权限注册该角色");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRealName(request.getRealName());
        user.setMobile(request.getMobile());
        user.setRoleCode(roleCode);
        user.setStatus("enabled");
        return userMapper.toResponse(userRepository.save(user));
    }


    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        CustomUserDetails userDetails = new CustomUserDetails(
                user.getId(),
                user.getUsername(),
                user.getPasswordHash(),
                user.getRealName(),
                user.getRoleCode(),
                "enabled".equals(user.getStatus())
        );

        String token = jwtUtil.generateToken(userDetails);

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setExpireAt(LocalDateTime.now().plusHours(24).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setRealName(user.getRealName());
        userInfo.setRoleCode(user.getRoleCode());
        response.setUser(userInfo);

        return response;
    }

    @Override
    public LoginResponse.UserInfo getCurrentUser() {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setRealName(user.getRealName());
        userInfo.setRoleCode(user.getRoleCode());
        return userInfo;
    }

    @Override
    public void logout() {
        org.springframework.security.core.context.SecurityContextHolder.clearContext();
    }
}
