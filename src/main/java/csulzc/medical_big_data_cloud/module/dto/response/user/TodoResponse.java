package csulzc.medical_big_data_cloud.module.dto.response.user;

import java.time.LocalDateTime;

public record TodoResponse(
        String id,
        String type,
        String title,
        String priority,
        LocalDateTime occurredAt
) {
}
