package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningAssignRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningHandleRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningQueryRequest;
import csulzc.medical_big_data_cloud.module.dto.response.warning.HealthWarningResponse;

public interface HealthWarningService {
    HealthWarningResponse create(HealthWarningCreateRequest request);

    HealthWarningResponse getById(String id);

    PageResult<HealthWarningResponse> list(HealthWarningQueryRequest request);

    HealthWarningResponse handle(String id, HealthWarningHandleRequest request);

    HealthWarningResponse assign(String id, HealthWarningAssignRequest request);

    void delete(String id);
}
