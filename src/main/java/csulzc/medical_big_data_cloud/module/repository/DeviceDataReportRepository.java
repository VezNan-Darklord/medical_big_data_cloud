package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.DeviceDataReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceDataReportRepository extends JpaRepository<DeviceDataReport, String> {
    List<DeviceDataReport> findTop100ByDeviceIdOrderByReportedAtDesc(String deviceId);
}
