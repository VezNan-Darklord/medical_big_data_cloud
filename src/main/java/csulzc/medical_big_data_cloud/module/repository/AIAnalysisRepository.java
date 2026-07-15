package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.AIAnalysis;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AIAnalysisRepository extends JpaRepository<AIAnalysis, String> {
    Page<AIAnalysis> findByScene(String scene, Pageable pageable);
}
