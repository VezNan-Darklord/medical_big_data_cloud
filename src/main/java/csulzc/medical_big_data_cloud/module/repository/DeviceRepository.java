// DeviceRepository.java
// 路径: src/main/java/csulzc/medical_big_data_cloud/module/device/repository/DeviceRepository.java
package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.Device;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<Device, String>, JpaSpecificationExecutor<Device> {

    List<Device> findByElderlyId(String elderlyId);

    List<Device> findByDeviceType(String deviceType);

    List<Device> findByBindingStatus(String bindingStatus);

    List<Device> findByOnlineStatus(String onlineStatus);

    Optional<Device> findByDeviceSn(String deviceSn);

    Page<Device> findByElderlyIdOrderByLastReportAtDesc(String elderlyId, Pageable pageable);

    Page<Device> findByOnlineStatusOrderByLastReportAtDesc(String onlineStatus, Pageable pageable);

    long countByOnlineStatus(String onlineStatus);

    long countByBindingStatus(String bindingStatus);

    long countByElderlyId(String elderlyId);
}
