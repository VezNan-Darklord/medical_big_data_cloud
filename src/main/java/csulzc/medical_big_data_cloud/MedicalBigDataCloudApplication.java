package csulzc.medical_big_data_cloud;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing
@SpringBootApplication
public class MedicalBigDataCloudApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedicalBigDataCloudApplication.class, args);
	}

}
