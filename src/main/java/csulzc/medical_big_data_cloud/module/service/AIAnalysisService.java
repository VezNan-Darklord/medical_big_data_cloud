package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.module.dto.request.ai.AnalysisRequest;
import csulzc.medical_big_data_cloud.module.dto.response.ai.AnalysisResult;

import java.util.List;

public interface AIAnalysisService {
    AnalysisResult analyze(AnalysisRequest request);

    List<AnalysisResult> history();

    AnalysisResult get(String id);

    void delete(String id);
}
