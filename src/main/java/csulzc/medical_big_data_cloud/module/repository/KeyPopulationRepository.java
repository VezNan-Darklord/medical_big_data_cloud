package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.KeyPopulation;
import csulzc.medical_big_data_cloud.module.repository.projection.LabelCount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KeyPopulationRepository
        extends JpaRepository<KeyPopulation, String>, JpaSpecificationExecutor<KeyPopulation> {

    List<KeyPopulation> findByElderlyIdOrderByCreatedAtDesc(String elderlyId);

    List<KeyPopulation> findByOwnerDoctorId(String ownerDoctorId);

    Page<KeyPopulation> findByStatus(String status, Pageable pageable);

    long countByCategoryAndStatus(String category, String status);

    long countByStatus(String status);

    @Query("""
            SELECT k.category AS label, COUNT(k) AS count
            FROM KeyPopulation k
            WHERE k.status = 'active'
            GROUP BY k.category
            """)
    List<LabelCount> countActiveGroupedByCategory();
}
