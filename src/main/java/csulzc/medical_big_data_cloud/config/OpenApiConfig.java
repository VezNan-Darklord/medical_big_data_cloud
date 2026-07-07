package csulzc.medical_big_data_cloud.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("医养结合云端后台管理系统 API")
                        .version("1.0.0")
                        .description("前后端分离的医养结合管理平台 RESTful API 文档"));
    }
}
