package csulzc.medical_big_data_cloud.module.service;

import csulzc.medical_big_data_cloud.common.result.PageResult;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceBindRequest;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceCreateRequest;
import csulzc.medical_big_data_cloud.module.dto.request.device.DeviceUpdateRequest;
import csulzc.medical_big_data_cloud.module.dto.response.device.DeviceResponse;

public interface DeviceService {
    DeviceResponse create(DeviceCreateRequest request);

    DeviceResponse getById(String id);

    PageResult<DeviceResponse> list(String bindingStatus, String onlineStatus, int pageNo, int pageSize);

    void bind(DeviceBindRequest request);

    void unbind(String id);

    DeviceResponse update(String id, DeviceUpdateRequest request);
}
