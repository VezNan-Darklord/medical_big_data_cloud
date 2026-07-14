package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.keypop.KeyPopulationCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.keypop.KeyPopulationUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.keypop.KeyPopulationResponse;

public interface KeyPopulationService {

    KeyPopulationResponse create(KeyPopulationCreateRequest request);

    KeyPopulationResponse update(String id, KeyPopulationUpdateRequest request);

    void close(String id);

    KeyPopulationResponse getById(String id);

    PageResult<KeyPopulationResponse> list(String status, int pageNo, int pageSize);

    void delete(String id);
}
