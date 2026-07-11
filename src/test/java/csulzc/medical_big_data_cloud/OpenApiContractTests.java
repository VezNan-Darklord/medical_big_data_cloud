package csulzc.medical_big_data_cloud;

import org.junit.jupiter.api.Test;
import org.yaml.snakeyaml.Yaml;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
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
    }
}
