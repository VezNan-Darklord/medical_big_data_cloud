package csulzc.medical_big_data_cloud.config;

import csulzc.medical_big_data_cloud.module.entity.User;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.bootstrap-admin", name = "enabled", havingValue = "true")
public class BootstrapAdminInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.bootstrap-admin.username:admin}")
    private String username;

    @Value("${app.bootstrap-admin.password:}")
    private String password;

    @Value("${app.bootstrap-admin.real-name:系统管理员}")
    private String realName;

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.countByRoleCode("admin") > 0) {
            return;
        }
        if (!StringUtils.hasText(username) || password == null || password.length() < 8) {
            throw new IllegalStateException("启用管理员引导时，用户名不能为空且密码长度至少为 8");
        }

        User admin = new User();
        admin.setUsername(username);
        admin.setPasswordHash(passwordEncoder.encode(password));
        admin.setRealName(realName);
        admin.setRoleCode("admin");
        admin.setStatus("enabled");
        userRepository.save(admin);
        log.warn("已创建引导管理员账号 {}，请登录后立即修改默认密码", username);
    }
}
