package csulzc.medical_big_data_cloud.module.service.impl;

import csulzc.medical_big_data_cloud.common.constant.ResultCode;
import csulzc.medical_big_data_cloud.common.exception.BusinessException;
import csulzc.medical_big_data_cloud.module.dto.request.auth.LoginRequest;
import csulzc.medical_big_data_cloud.module.dto.response.auth.LoginResponse;
import csulzc.medical_big_data_cloud.module.entity.User;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import csulzc.medical_big_data_cloud.module.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND));

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        LoginResponse response = new LoginResponse();
        response.setToken(UUID.randomUUID().toString().replace("-", ""));
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
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
        SecurityContextHolder.clearContext();
    }
}
