package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.common.result.FilePayload;
import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.report.AssessmentReportCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.report.AssessmentReportReviewRequest;
import csulzc.medical_big_data_cloud.module.dto.response.report.AssessmentReportResponse;

public interface AssessmentReportService {
    AssessmentReportResponse create(AssessmentReportCreateRequest request);

    AssessmentReportResponse getById(String id);

    PageResult<AssessmentReportResponse> list(String elderlyId, int pageNo, int pageSize);

    PageResult<AssessmentReportResponse> listForElderlyUser(String userId, int pageNo, int pageSize);

    AssessmentReportResponse review(String id, AssessmentReportReviewRequest request);

    FilePayload export(String id);

    void delete(String id);
}
