// HealthWarningRepository.java
// 路径: src/main/java/csulzc/medical_big_data_cloud/module/health/repository/HealthWarningRepository.java
package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.HealthWarning;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HealthWarningRepository extends JpaRepository<HealthWarning, String>, JpaSpecificationExecutor<HealthWarning> {

    List<HealthWarning> findByElderlyId(String elderlyId);

    List<HealthWarning> findByStatus(String status);

    List<HealthWarning> findBySeverity(String severity);

    List<HealthWarning> findByWarningType(String warningType);

    List<HealthWarning> findBySource(String source);

    List<HealthWarning> findByHandlerId(String handlerId);

    Page<HealthWarning> findByElderlyIdOrderByOccurredAtDesc(String elderlyId, Pageable pageable);

    @Query("SELECT hw FROM HealthWarning hw WHERE hw.occurredAt BETWEEN :startTime AND :endTime")
    List<HealthWarning> findByOccurredAtBetween(@Param("startTime") LocalDateTime startTime, @Param("endTime") LocalDateTime endTime);

    long countByStatus(String status);

    long countBySeverity(String severity);

    @Query("SELECT hw.warningType, COUNT(hw) FROM HealthWarning hw GROUP BY hw.warningType")
    List<Object[]> countGroupByWarningType();
}
