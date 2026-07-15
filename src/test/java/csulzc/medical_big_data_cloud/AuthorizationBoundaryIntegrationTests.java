package csulzc.medical_big_data_cloud;

import csulzc.medical_big_data_cloud.module.entity.HealthWarning;
import csulzc.medical_big_data_cloud.module.entity.User;
import csulzc.medical_big_data_cloud.module.repository.HealthWarningRepository;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:authorization_boundary;MODE=MySQL;DATABASE_TO_LOWER=TRUE;DB_CLOSE_DELAY=-1"
})
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthorizationBoundaryIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HealthWarningRepository healthWarningRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void roleMatrixMatchesReadAndWriteEndpoints() throws Exception {
        String suffix = suffix();
        User admin = createUser("matrix_admin_" + suffix, "admin");
        User doctor = createUser("matrix_doctor_" + suffix, "doctor");
        User operator = createUser("matrix_operator_" + suffix, "operator");
        User analyst = createUser("matrix_analyst_" + suffix, "analyst");
        User elderly = createUser("matrix_elderly_" + suffix, "elderly");

        String adminToken = login(admin.getUsername());
        String doctorToken = login(doctor.getUsername());
        String operatorToken = login(operator.getUsername());
        String analystToken = login(analyst.getUsername());
        String elderlyToken = login(elderly.getUsername());

        expectGet("/dashboard/overview", adminToken, 200);
        expectGet("/dashboard/overview", doctorToken, 200);
        expectGet("/dashboard/overview", operatorToken, 200);
        expectGet("/dashboard/overview", analystToken, 200);
        expectGet("/dashboard/overview", elderlyToken, 403);

        expectGet("/elderly-accounts", adminToken, 200);
        expectGet("/elderly-accounts", doctorToken, 200);
        expectGet("/elderly-accounts", operatorToken, 200);
        expectGet("/elderly-accounts", analystToken, 403);
        expectGet("/elderly-accounts", elderlyToken, 403);

        expectGet("/ai/analysis/care-decision/history", adminToken, 200);
        expectGet("/ai/analysis/care-decision/history", doctorToken, 200);
        expectGet("/ai/analysis/care-decision/history", analystToken, 200);
        expectGet("/ai/analysis/care-decision/history", operatorToken, 403);

        expectGet("/reports/statistics/overview", adminToken, 200);
        expectGet("/reports/statistics/overview", doctorToken, 403);
        expectGet("/reports/statistics/overview", operatorToken, 403);
        expectGet("/reports/statistics/overview", analystToken, 403);

        mockMvc.perform(post("/elderly-accounts")
                        .header("Authorization", "Bearer " + doctorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "username", "forbidden_elderly_" + suffix,
                                "password", "Password123",
                                "realName", "Forbidden Elderly"
                        ))))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403));
    }

    @Test
    void specializedAccountEndpointsCannotModifyAnotherRole() throws Exception {
        String suffix = suffix();
        User admin = createUser("boundary_admin_" + suffix, "admin");
        User operator = createUser("boundary_operator_" + suffix, "operator");
        User doctor = createUser("boundary_doctor_" + suffix, "doctor");
        User elderly = createUser("boundary_elderly_" + suffix, "elderly");

        String adminToken = login(admin.getUsername());
        String operatorToken = login(operator.getUsername());

        mockMvc.perform(post("/elderly-accounts/{id}/status", admin.getId())
                        .header("Authorization", "Bearer " + operatorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"disabled\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404));

        mockMvc.perform(post("/elderly-accounts/{id}/reset-password", doctor.getId())
                        .header("Authorization", "Bearer " + operatorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"newPassword\":\"ChangedPass123\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404));

        mockMvc.perform(put("/doctor-accounts/{id}", elderly.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"realName\":\"Wrong Role Update\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404));

        mockMvc.perform(post("/doctor-accounts/{id}/reset-password", admin.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"newPassword\":\"ChangedPass123\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404));

        assertEquals("enabled", userRepository.findById(admin.getId()).orElseThrow().getStatus());
        assertEquals("admin", userRepository.findById(admin.getId()).orElseThrow().getRoleCode());
        assertEquals("elderly", userRepository.findById(elderly.getId()).orElseThrow().getRoleCode());

        mockMvc.perform(post("/elderly-accounts/{id}/status", elderly.getId())
                        .header("Authorization", "Bearer " + operatorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"disabled\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0));
    }

    @Test
    void warningWorkflowPreservesClosedStateAndTrustedHandlerIdentity() throws Exception {
        String suffix = suffix();
        User admin = createUser("warning_admin_" + suffix, "admin");
        User doctor = createUser("warning_doctor_" + suffix, "doctor");
        User operator = createUser("warning_operator_" + suffix, "operator");
        String adminToken = login(admin.getUsername());

        HealthWarning closedWarning = createWarning("closed");
        mockMvc.perform(post("/health-warnings/{id}/assign", closedWarning.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "handlerId", doctor.getId(),
                                "handlerName", "Spoofed Doctor"
                        ))))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.code").value(409));
        assertEquals("closed", healthWarningRepository.findById(closedWarning.getId())
                .orElseThrow().getStatus());

        HealthWarning openWarning = createWarning("unprocessed");
        mockMvc.perform(post("/health-warnings/{id}/handle", openWarning.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "status", "processed",
                                "handlerId", operator.getId(),
                                "handlerName", "Spoofed Operator"
                        ))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));
        assertEquals("unprocessed", healthWarningRepository.findById(openWarning.getId())
                .orElseThrow().getStatus());

        mockMvc.perform(post("/health-warnings/{id}/assign", openWarning.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "handlerId", doctor.getId(),
                                "handlerName", "Spoofed Doctor"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.status").value("processing"))
                .andExpect(jsonPath("$.data.handlerId").value(doctor.getId()))
                .andExpect(jsonPath("$.data.handlerName").value(doctor.getRealName()));

        HealthWarning handledWarning = createWarning("unprocessed");
        mockMvc.perform(post("/health-warnings/{id}/handle", handledWarning.getId())
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"processed\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.handlerId").value(admin.getId()))
                .andExpect(jsonPath("$.data.handlerName").value(admin.getRealName()))
                .andExpect(jsonPath("$.data.handledAt").isNotEmpty());
    }

    private void expectGet(String path, String token, int expectedStatus) throws Exception {
        mockMvc.perform(get(path).header("Authorization", "Bearer " + token))
                .andExpect(status().is(expectedStatus))
                .andExpect(jsonPath("$.code").value(expectedStatus == 200 ? 0 : expectedStatus));
    }

    private User createUser(String username, String roleCode) {
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode("Password123"));
        user.setRealName(roleCode + " user");
        user.setRoleCode(roleCode);
        user.setStatus("enabled");
        return userRepository.saveAndFlush(user);
    }

    private HealthWarning createWarning(String status) {
        HealthWarning warning = new HealthWarning();
        warning.setElderlyId(UUID.randomUUID().toString());
        warning.setWarningType("abnormal_heart_rate");
        warning.setSeverity("high");
        warning.setSource("device");
        warning.setStatus(status);
        warning.setOccurredAt(LocalDateTime.now());
        return healthWarningRepository.saveAndFlush(warning);
    }

    private String login(String username) throws Exception {
        return objectMapper.readTree(mockMvc.perform(post("/auth/login")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(
                                        Map.of("username", username, "password", "Password123"))))
                        .andExpect(status().isOk())
                        .andReturn()
                        .getResponse()
                        .getContentAsByteArray())
                .at("/data/accessToken")
                .asString();
    }

    private String suffix() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 10);
    }
}
