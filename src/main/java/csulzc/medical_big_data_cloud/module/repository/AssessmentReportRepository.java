package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.AssessmentReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentReportRepository
        extends JpaRepository<AssessmentReport, String>, JpaSpecificationExecutor<AssessmentReport> {

    List<AssessmentReport> findByElderlyId(String elderlyId);

    Page<AssessmentReport> findByAssessorId(String assessorId, Pageable pageable);

    List<AssessmentReport> findByElderlyIdOrderByAssessedAtDesc(String elderlyId);
}
