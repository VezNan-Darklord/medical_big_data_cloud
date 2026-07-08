// ElderlyProfileRepository.java
// 路径: src/main/java/csulzc/medical_big_data_cloud/module/elderly/repository/ElderlyProfileRepository.java
package csulzc.medical_big_data_cloud.module.elderly.repository;

import csulzc.medical_big_data_cloud.module.elderly.entity.ElderlyProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ElderlyProfileRepository extends JpaRepository<ElderlyProfile, String>, JpaSpecificationExecutor<ElderlyProfile> {

    Optional<ElderlyProfile> findByName(String name);

    List<ElderlyProfile> findByStatus(String status);

    List<ElderlyProfile> findByGender(String gender);

    List<ElderlyProfile> findByCareLevel(String careLevel);

    List<ElderlyProfile> findByInstitutionId(String institutionId);

    List<ElderlyProfile> findByNameContainingIgnoreCase(String keyword);

    Page<ElderlyProfile> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    long countByStatus(String status);
}
