package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.report.AssessmentReportCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.report.AssessmentReportResponse;

public interface AssessmentReportService {

    AssessmentReportResponse create(AssessmentReportCreateRequest request);

    AssessmentReportResponse getById(String id);

    PageResult<AssessmentReportResponse> listByElderlyId(String elderlyId, int pageNo, int pageSize);

    void delete(String id);
}
