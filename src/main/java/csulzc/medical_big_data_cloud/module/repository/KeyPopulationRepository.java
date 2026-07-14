package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.KeyPopulation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KeyPopulationRepository
        extends JpaRepository<KeyPopulation, String>, JpaSpecificationExecutor<KeyPopulation> {

    List<KeyPopulation> findByElderlyId(String elderlyId);

    List<KeyPopulation> findByOwnerDoctorId(String ownerDoctorId);

    Page<KeyPopulation> findByStatus(String status, Pageable pageable);

    long countByCategoryAndStatus(String category, String status);

    void delete(String id);
}
