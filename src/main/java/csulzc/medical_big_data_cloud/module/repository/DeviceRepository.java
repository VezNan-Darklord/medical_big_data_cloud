package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.Device;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeviceRepository
        extends JpaRepository<Device, String>, JpaSpecificationExecutor<Device> {

    Optional<Device> findByDeviceSn(String deviceSn);

    List<Device> findByElderlyId(String elderlyId);

    Page<Device> findByBindingStatus(String bindingStatus, Pageable pageable);

    Page<Device> findByOnlineStatus(String onlineStatus, Pageable pageable);

    long countByOnlineStatus(String onlineStatus);

    long countByBindingStatus(String bindingStatus);

    @Modifying
    @Query("UPDATE Device d SET d.elderlyId = ?2, d.bindingStatus = ?3 WHERE d.id = ?1")
    void updateBinding(String id, String elderlyId, String bindingStatus);

    void delete(String id);
}
