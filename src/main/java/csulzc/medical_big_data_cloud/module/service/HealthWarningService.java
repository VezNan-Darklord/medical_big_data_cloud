package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningHandleRequest;
import csulzc.medical_big_data_cloud.module.dto.request.warning.HealthWarningQueryRequest;
import csulzc.medical_big_data_cloud.module.dto.response.warning.HealthWarningResponse;
import org.springframework.transaction.annotation.Transactional;

public interface HealthWarningService {

    @Transactional
    HealthWarningResponse create(HealthWarningCreateRequest request);

    HealthWarningResponse getById(String id);

    PageResult<HealthWarningResponse> list(HealthWarningQueryRequest request);

    void handle(String id, HealthWarningHandleRequest request);

    void delete(String id);
}
