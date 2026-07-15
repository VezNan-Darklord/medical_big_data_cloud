package csulzc.medical_big_data_cloud.module.dto.response.ai;

import java.time.LocalDateTime;
import java.util.List;

public record AnalysisResult(
        String id,
        String scene,
        String summary,
        List<Insight> insights,
        List<Action> actions,
        List<Chart> charts,
        LocalDateTime createdAt
) {
    public record Insight(String type, String title, String description,
                          double confidence, String suggestion) {
    }

    public record Action(String actionType, String target, String priority, String expectedEffect) {
    }

    public record Chart(String chartType, String title, String optionKey) {
    }
}
