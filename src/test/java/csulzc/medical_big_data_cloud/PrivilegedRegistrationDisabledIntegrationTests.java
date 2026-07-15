package csulzc.medical_big_data_cloud;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "app.auth.apifox-privileged-registration-enabled=false",
        "spring.datasource.url=jdbc:h2:mem:privileged_registration_disabled;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1"
})
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PrivilegedRegistrationDisabledIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void spoofedApifoxUserAgentCannotRegisterAdministratorWhenFeatureIsDisabled() throws Exception {
        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);

        mockMvc.perform(post("/auth/register")
                        .header("User-Agent", "Apifox/2.7.0")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "username": "blocked_admin_%s",
                                  "password": "Password123",
                                  "realName": "Blocked Admin",
                                  "roleCode": "admin"
                                }
                                """.formatted(suffix)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403));
    }
}
