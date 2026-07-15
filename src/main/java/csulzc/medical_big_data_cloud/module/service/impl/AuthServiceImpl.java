package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.common.util.SecurityUtil;
import csulzc.medical_big_data_cloud.config.security.CustomUserDetails;
import csulzc.medical_big_data_cloud.config.security.CustomUserDetailsService;
import csulzc.medical_big_data_cloud.config.security.JwtUtil;
import csulzc.medical_big_data_cloud.module.dto.request.auth.LoginRequest;
import csulzc.medical_big_data_cloud.module.dto.request.auth.RegisterRequest;
import csulzc.medical_big_data_cloud.module.dto.response.auth.LoginResponse;
import csulzc.medical_big_data_cloud.module.dto.response.user.UserResponse;
import csulzc.medical_big_data_cloud.module.entity.RefreshToken;
import csulzc.medical_big_data_cloud.module.entity.User;
import csulzc.medical_big_data_cloud.module.mapper.UserMapper;
import csulzc.medical_big_data_cloud.module.repository.RefreshTokenRepository;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import csulzc.medical_big_data_cloud.module.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final CustomUserDetailsService userDetailsService;

    @Value("${jwt.refresh-expiration:604800000}")
    private long refreshExpiration;

    @Value("${app.auth.apifox-privileged-registration-enabled:false}")
    private boolean apifoxPrivilegedRegistrationEnabled;

    @Override
    @Transactional
    public LoginResponse register(RegisterRequest request, String userAgent) {
        checkUniqueIdentity(request.getUsername(), request.getMobile(), null);
        String roleCode = resolveRegistrationRole(request.getRoleCode(), userAgent);

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRealName(request.getRealName());
        user.setMobile(request.getMobile());
        user.setRoleCode(roleCode);
        user.setStatus("enabled");
        user.setLastLoginAt(LocalDateTime.now());
        user = userRepository.save(user);
        return issueTokenPair(user);
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException(ResultCode.UNAUTHORIZED, "用户名或密码错误"));
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        return issueTokenPair(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser() {
        return userMapper.toResponse(findCurrentUser());
    }

    @Override
    @Transactional
    public void logout(String refreshToken) {
        User user = findCurrentUser();
        user.setTokenVersion(user.getTokenVersion() + 1);
        userRepository.save(user);

        if (StringUtils.hasText(refreshToken)) {
            refreshTokenRepository.findByTokenHash(hash(refreshToken))
                    .filter(token -> token.getUserId().equals(user.getId()))
                    .ifPresent(this::revoke);
        } else {
            refreshTokenRepository.findByUserIdAndRevokedAtIsNull(user.getId()).forEach(this::revoke);
        }
    }

    @Override
    @Transactional
    public LoginResponse refreshToken(String rawRefreshToken) {
        RefreshToken storedToken = refreshTokenRepository.findByTokenHash(hash(rawRefreshToken))
                .orElseThrow(() -> new BusinessException(ResultCode.UNAUTHORIZED, "刷新令牌无效"));
        if (storedToken.getRevokedAt() != null || storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException(ResultCode.UNAUTHORIZED, "刷新令牌已失效");
        }

        User user = userRepository.findById(storedToken.getUserId())
                .filter(candidate -> "enabled".equals(candidate.getStatus()))
                .orElseThrow(() -> new BusinessException(ResultCode.UNAUTHORIZED, "账号不可用"));
        revoke(storedToken);
        return issueTokenPair(user);
    }

    private LoginResponse issueTokenPair(User user) {
        CustomUserDetails userDetails = userDetailsService.fromUser(user);
        String accessToken = jwtUtil.generateAccessToken(userDetails);
        String rawRefreshToken = newRefreshToken();
        LocalDateTime refreshExpiresAt = LocalDateTime.now().plus(Duration.ofMillis(refreshExpiration));

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUserId(user.getId());
        refreshToken.setTokenHash(hash(rawRefreshToken));
        refreshToken.setExpiresAt(refreshExpiresAt);
        refreshTokenRepository.save(refreshToken);

        LocalDateTime accessExpiresAt = LocalDateTime.ofInstant(
                jwtUtil.getAccessExpiresAt(accessToken), ZoneId.systemDefault());

        LoginResponse response = new LoginResponse();
        response.setToken(accessToken);
        response.setAccessToken(accessToken);
        response.setRefreshToken(rawRefreshToken);
        response.setTokenType("Bearer");
        response.setExpireAt(accessExpiresAt.format(DATE_TIME_FORMATTER));
        response.setAccessExpireAt(accessExpiresAt.format(DATE_TIME_FORMATTER));
        response.setRefreshExpireAt(refreshExpiresAt.format(DATE_TIME_FORMATTER));

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setRealName(user.getRealName());
        userInfo.setRoleCode(user.getRoleCode());
        userInfo.setMobile(user.getMobile());
        response.setUser(userInfo);
        return response;
    }

    private String resolveRegistrationRole(String requestedRole, String userAgent) {
        String roleCode = StringUtils.hasText(requestedRole) ? requestedRole : "elderly";
        boolean isPrivilegedApifoxRequest = apifoxPrivilegedRegistrationEnabled
                && StringUtils.hasText(userAgent)
                && userAgent.toLowerCase(Locale.ROOT).contains("apifox");
        if (!"elderly".equals(roleCode) && !isPrivilegedApifoxRequest) {
            throw new BusinessException(
                    ResultCode.FORBIDDEN,
                    "前端注册仅允许创建老人账号，管理员和医生账号请使用 Apifox 或管理员功能创建");
        }
        return roleCode;
    }

    private User findCurrentUser() {
        return userRepository.findById(SecurityUtil.getCurrentUserId())
                .orElseThrow(() -> new BusinessException(ResultCode.UNAUTHORIZED));
    }

    private void checkUniqueIdentity(String username, String mobile, String excludedUserId) {
        userRepository.findByUsername(username)
                .filter(user -> !user.getId().equals(excludedUserId))
                .ifPresent(user -> {
                    throw new BusinessException(ResultCode.CONFLICT, "用户名已存在");
                });
        if (StringUtils.hasText(mobile)) {
            userRepository.findByMobile(mobile)
                    .filter(user -> !user.getId().equals(excludedUserId))
                    .ifPresent(user -> {
                        throw new BusinessException(ResultCode.CONFLICT, "手机号已被使用");
                    });
        }
    }

    private void revoke(RefreshToken token) {
        token.setRevokedAt(LocalDateTime.now());
        refreshTokenRepository.save(token);
    }

    private String newRefreshToken() {
        byte[] bytes = new byte[48];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hash(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));
            return java.util.HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }
}
