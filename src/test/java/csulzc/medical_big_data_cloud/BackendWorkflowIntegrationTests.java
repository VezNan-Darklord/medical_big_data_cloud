package csulzc.medical_big_data_cloud;

import csulzc.medical_big_data_cloud.module.entity.User;
import csulzc.medical_big_data_cloud.module.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.blankOrNullString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BackendWorkflowIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    void authenticationAuthorizationAndReportWorkflowUseRealHttpSemantics() throws Exception {
        mockMvc.perform(get("/dashboard/overview"))
                .andExpect(status().isUnauthorized())
                .andExpect(header().string("X-Trace-Id", not(blankOrNullString())))
                .andExpect(jsonPath("$.code").value(401))
                .andExpect(jsonPath("$.traceId", not(blankOrNullString())));

        mockMvc.perform(get("/api-docs"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.openapi", not(blankOrNullString())));

        String suffix = UUID.randomUUID().toString().replace("-", "").substring(0, 10);
        String doctorUsername = "doctor_" + suffix;
        createDoctor(doctorUsername, "DoctorPass123");
        String doctorToken = login(doctorUsername, "DoctorPass123")
                .at("/data/accessToken").asString();

        mockMvc.perform(get("/dashboard/charts")
                        .header("Authorization", "Bearer " + doctorToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").isArray());

        mockMvc.perform(get("/elderly-profiles")
                        .header("Authorization", "Bearer " + doctorToken)
                        .queryParam("pageNo", "0"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value(400));

        String elderlyUsername = "elderly_" + suffix;
        String registerJson = """
                {
                  "username": "%s",
                  "password": "ElderlyPass123",
                  "realName": "测试老人"
                }
                """.formatted(elderlyUsername);

        MvcResult registerResult = mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(registerJson))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.accessToken", not(blankOrNullString())))
                .andExpect(jsonPath("$.data.refreshToken", not(blankOrNullString())))
                .andReturn();
        JsonNode registerBody = readBody(registerResult);
        String elderlyUserId = registerBody.at("/data/user/id").asString();
        String elderlyAccessToken = registerBody.at("/data/accessToken").asString();
        String firstRefreshToken = registerBody.at("/data/refreshToken").asString();

        MvcResult refreshResult = mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                java.util.Map.of("refreshToken", firstRefreshToken))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andReturn();
        String rotatedRefreshToken = readBody(refreshResult).at("/data/refreshToken").asString();
        org.junit.jupiter.api.Assertions.assertNotEquals(firstRefreshToken, rotatedRefreshToken);

        mockMvc.perform(post("/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                java.util.Map.of("refreshToken", firstRefreshToken))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value(401));

        mockMvc.perform(post("/elderly-profiles")
                        .header("Authorization", "Bearer " + elderlyAccessToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"name":"无权限创建","gender":"unknown"}
                                """))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403));

        mockMvc.perform(get("/elderly-profiles")
                        .header("Authorization", "Bearer " + elderlyAccessToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403));

        MvcResult elderlyResult = mockMvc.perform(post("/elderly-profiles")
                        .header("Authorization", "Bearer " + doctorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "name": "报告流程测试老人",
                                  "userId": "%s",
                                  "gender": "female",
                                  "birthday": "1950-05-12",
                                  "careLevel": "C2",
                                  "tags": ["慢病", "测试"]
                                }
                                """.formatted(elderlyUserId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.age").isNumber())
                .andReturn();
        String elderlyId = readBody(elderlyResult).at("/data/id").asString();

        mockMvc.perform(post("/health-warnings")
                        .header("Authorization", "Bearer " + doctorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "elderlyId": "%s",
                                  "warningType": "abnormal_heart_rate",
                                  "severity": "high",
                                  "source": "device",
                                  "metricName": "heartRate",
                                  "metricValue": 128,
                                  "thresholdValue": 100,
                                  "occurredAt": "%s"
                                }
                                """.formatted(elderlyId, LocalDateTime.now())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.status").value("unprocessed"));

        mockMvc.perform(get("/health-warnings")
                        .header("Authorization", "Bearer " + elderlyAccessToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.total").value(1))
                .andExpect(jsonPath("$.data.list[0].elderlyId").value(elderlyId));

        mockMvc.perform(get("/dashboard/overview")
                        .header("Authorization", "Bearer " + elderlyAccessToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value(403));

        MvcResult reportResult = mockMvc.perform(post("/assessment-reports")
                        .header("Authorization", "Bearer " + doctorToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "elderlyId": "%s",
                                  "reportType": "health_assessment"
                                }
                                """.formatted(elderlyId)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.score").value(88))
                .andExpect(jsonPath("$.data.grade").value("B"))
                .andExpect(jsonPath("$.data.reviewStatus").value("draft"))
                .andExpect(jsonPath("$.data.riskItems[0]", containsString("abnormal_heart_rate")))
                .andReturn();
        String reportId = readBody(reportResult).at("/data/id").asString();

        mockMvc.perform(get("/assessment-reports/{id}/export", reportId)
                        .header("Authorization", "Bearer " + doctorToken))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith("text/markdown"))
                .andExpect(header().string("Content-Disposition", containsString(".md")))
                .andExpect(content().string(containsString("# 健康评估报告")))
                .andExpect(content().string(containsString("abnormal_heart_rate")));

        mockMvc.perform(get("/assessment-reports/{id}", "missing-report")
                        .header("Authorization", "Bearer " + doctorToken))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.traceId", not(blankOrNullString())));
    }

    private JsonNode login(String username, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                java.util.Map.of("username", username, "password", password))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andReturn();
        return readBody(result);
    }

    private JsonNode readBody(MvcResult result) {
        return objectMapper.readTree(result.getResponse().getContentAsByteArray());
    }

    private void createDoctor(String username, String password) {
        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRealName("测试医生");
        user.setRoleCode("doctor");
        user.setStatus("enabled");
        userRepository.saveAndFlush(user);
    }
}
