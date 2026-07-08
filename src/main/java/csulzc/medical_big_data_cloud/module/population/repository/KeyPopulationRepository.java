// KeyPopulationRepository.java
// 路径: src/main/java/csulzc/medical_big_data_cloud/module/population/repository/KeyPopulationRepository.java
package csulzc.medical_big_data_cloud.module.population.repository;

import csulzc.medical_big_data_cloud.module.population.entity.KeyPopulation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KeyPopulationRepository extends JpaRepository<KeyPopulation, String>, JpaSpecificationExecutor<KeyPopulation> {

    List<KeyPopulation> findByElderlyId(String elderlyId);

    List<KeyPopulation> findByStatus(String status);

    List<KeyPopulation> findByCategory(String category);

    List<KeyPopulation> findByLevel(String level);

    List<KeyPopulation> findByOwnerDoctorId(String ownerDoctorId);

    Optional<KeyPopulation> findByElderlyIdAndStatus(String elderlyId, String status);

    Page<KeyPopulation> findByOwnerDoctorIdOrderByCreatedAtDesc(String ownerDoctorId, Pageable pageable);

    Page<KeyPopulation> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    long countByStatus(String status);

    long countByCategory(String category);
}
