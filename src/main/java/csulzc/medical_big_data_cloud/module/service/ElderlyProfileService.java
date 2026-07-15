package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileQueryRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.device.DeviceResponse;
import csulzc.medical_big_data_cloud.module.dto.response.elderly.ElderlyProfileResponse;
import csulzc.medical_big_data_cloud.module.dto.response.keypop.KeyPopulationResponse;
import csulzc.medical_big_data_cloud.module.dto.response.report.AssessmentReportResponse;
import csulzc.medical_big_data_cloud.module.dto.response.warning.HealthWarningResponse;

import java.util.List;

public interface ElderlyProfileService {
    ElderlyProfileResponse create(ElderlyProfileCreateRequest request);

    ElderlyProfileResponse update(String id, ElderlyProfileUpdateRequest request);

    ElderlyProfileResponse getById(String id);

    void delete(String id);

    PageResult<ElderlyProfileResponse> list(ElderlyProfileQueryRequest request);

    ElderlyProfileResponse getMyProfile(String userId);

    List<HealthWarningResponse> getWarnings(String id);

    List<AssessmentReportResponse> getReports(String id);

    List<DeviceResponse> getDevices(String id);

    List<KeyPopulationResponse> getKeyPopulations(String id);
}
