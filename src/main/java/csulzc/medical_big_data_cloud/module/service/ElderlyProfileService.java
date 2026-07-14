package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileQueryRequest;
import csulzc.medical_big_data_cloud.module.dto.request.elderly.ElderlyProfileUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.elderly.ElderlyProfileResponse;

public interface ElderlyProfileService {

    ElderlyProfileResponse create(ElderlyProfileCreateRequest request);

    ElderlyProfileResponse update(String id, ElderlyProfileUpdateRequest request);

    ElderlyProfileResponse getById(String id);

    void delete(String id);

    PageResult<ElderlyProfileResponse> list(ElderlyProfileQueryRequest request);

    ElderlyProfileResponse getMyProfile(String userId);
}
