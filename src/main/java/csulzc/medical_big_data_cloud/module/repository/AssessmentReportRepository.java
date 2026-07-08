// AssessmentReportRepository.java
// 路径: src/main/java/csulzc/medical_big_data_cloud/module/report/repository/AssessmentReportRepository.java
package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.AssessmentReport;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssessmentReportRepository extends JpaRepository<AssessmentReport, String>, JpaSpecificationExecutor<AssessmentReport> {

    List<AssessmentReport> findByElderlyId(String elderlyId);

    List<AssessmentReport> findByReportType(String reportType);

    List<AssessmentReport> findByAssessorId(String assessorId);

    List<AssessmentReport> findByGrade(String grade);

    Page<AssessmentReport> findByElderlyIdOrderByAssessedAtDesc(String elderlyId, Pageable pageable);

    Page<AssessmentReport> findByReportTypeOrderByAssessedAtDesc(String reportType, Pageable pageable);

    long countByElderlyId(String elderlyId);
}
