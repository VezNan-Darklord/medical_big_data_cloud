package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.HealthWarning;
import csulzc.medical_big_data_cloud.module.repository.projection.LabelCount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface HealthWarningRepository
        extends JpaRepository<HealthWarning, String>, JpaSpecificationExecutor<HealthWarning> {

    List<HealthWarning> findByElderlyIdOrderByOccurredAtDesc(String elderlyId);

    List<HealthWarning> findByElderlyIdAndStatus(String elderlyId, String status);

    long countByStatus(String status);

    long countByStatusIn(List<String> statuses);

    long countBySeverityAndStatus(String severity, String status);

    @Query("SELECT w.severity AS label, COUNT(w) AS count FROM HealthWarning w GROUP BY w.severity")
    List<LabelCount> countGroupedBySeverity();

    List<HealthWarning> findByOccurredAtBetweenOrderByOccurredAtAsc(LocalDateTime start, LocalDateTime end);

    List<HealthWarning> findByHandlerIdAndStatusInOrderByOccurredAtDesc(String handlerId, List<String> statuses);

    /**
     * 处理预警时更新状态和处理人
     */
    @Modifying
    @Query("UPDATE HealthWarning w SET w.status = ?2, w.handlerId = ?3, w.handledAt = ?4 WHERE w.id = ?1")
    void updateStatusAndHandler(String id, String status, String handlerId, LocalDateTime handledAt);
}
