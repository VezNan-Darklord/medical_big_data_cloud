package csulzc.medical_big_data_cloud;

import org.junit.jupiter.api.Test;
import org.yaml.snakeyaml.Yaml;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class OpenApiContractTests {
    @Test
    void openApiYamlIsParseableAndContainsRequiredSections() throws IOException {
        Map<String, Object> document = new Yaml().load(Files.readString(Path.of("openapi.yaml")));
        assertEquals("3.0.3", document.get("openapi"));
        assertTrue(document.containsKey("info"));
        assertTrue(document.containsKey("servers"));
        assertTrue(document.containsKey("tags"));
        assertTrue(document.containsKey("paths"));
        assertTrue(document.containsKey("components"));

        Map<String, Object> paths = castMap(document.get("paths"));
        assertTrue(paths.containsKey("/auth/refresh"));
        assertTrue(paths.containsKey("/assessment-reports/{id}/review"));
        assertTrue(paths.containsKey("/devices/{id}/reports"));
        assertTrue(paths.containsKey("/profile/change-password"));
        assertTrue(paths.containsKey("/profile/reports"));

        Map<String, Object> components = castMap(document.get("components"));
        Map<String, Object> schemas = castMap(components.get("schemas"));
        Map<String, Object> responses = castMap(components.get("responses"));
        Map<String, Object> requestBodies = castMap(components.get("requestBodies"));
        Map<String, Object> parameters = castMap(components.get("parameters"));
        Map<String, Object> securitySchemes = castMap(components.get("securitySchemes"));
        assertTrue(schemas.containsKey("StatisticsOverview"));
        assertTrue(schemas.containsKey("ApiStatisticsOverview"));

        Map<String, Object> registerRequest = castMap(schemas.get("RegisterRequest"));
        Map<String, Object> registerProperties = castMap(registerRequest.get("properties"));
        Map<String, Object> registerRole = castMap(registerProperties.get("roleCode"));
        assertEquals(
                Set.of("elderly", "doctor", "admin"),
                new HashSet<>((java.util.List<String>) registerRole.get("enum")));

        Map<String, Object> registerOperation = castMap(castMap(paths.get("/auth/register")).get("post"));
        Map<String, Object> registerResponses = castMap(registerOperation.get("responses"));
        assertTrue(registerResponses.containsKey("403"));

        Map<String, Object> reportCreate = castMap(schemas.get("AssessmentReportCreateRequest"));
        Set<String> requiredReportFields = new HashSet<>((java.util.List<String>) reportCreate.get("required"));
        assertTrue(requiredReportFields.containsAll(Set.of(
                "elderlyId", "reportType", "score", "grade", "summary",
                "riskItems", "recommendations", "assessedAt"
        )));

        Set<String> operationIds = new HashSet<>();
        paths.values().stream()
                .map(OpenApiContractTests::castMap)
                .flatMap(path -> path.entrySet().stream())
                .filter(entry -> Set.of("get", "post", "put", "patch", "delete").contains(entry.getKey()))
                .map(entry -> castMap(entry.getValue()))
                .forEach(operation -> {
                    String operationId = (String) operation.get("operationId");
                    assertTrue(operationId != null && !operationId.isBlank());
                    assertTrue(operationIds.add(operationId), "重复 operationId: " + operationId);
                });

        assertFalse(operationIds.isEmpty());
        assertAllReferencesResolve(document, schemas, responses, requestBodies, parameters, securitySchemes);
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> castMap(Object value) {
        return (Map<String, Object>) value;
    }

    private static void assertAllReferencesResolve(
            Object value,
            Map<String, Object> schemas,
            Map<String, Object> responses,
            Map<String, Object> requestBodies,
            Map<String, Object> parameters,
            Map<String, Object> securitySchemes) {
        if (value instanceof Map<?, ?> map) {
            Object reference = map.get("$ref");
            if (reference instanceof String ref) {
                String[] parts = ref.split("/");
                assertEquals(4, parts.length, "不支持的引用: " + ref);
                Map<String, Object> section = switch (parts[2]) {
                    case "schemas" -> schemas;
                    case "responses" -> responses;
                    case "requestBodies" -> requestBodies;
                    case "parameters" -> parameters;
                    case "securitySchemes" -> securitySchemes;
                    default -> throw new AssertionError("未知引用类型: " + ref);
                };
                assertTrue(section.containsKey(parts[3]), "无法解析引用: " + ref);
            }
            map.values().forEach(child -> assertAllReferencesResolve(
                    child, schemas, responses, requestBodies, parameters, securitySchemes));
        } else if (value instanceof Iterable<?> iterable) {
            iterable.forEach(child -> assertAllReferencesResolve(
                    child, schemas, responses, requestBodies, parameters, securitySchemes));
        }
    }
}
