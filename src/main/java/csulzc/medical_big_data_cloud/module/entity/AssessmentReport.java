package csulzc.medical_big_data_cloud.module.entity;

import csulzc.medical_big_data_cloud.common.converter.StringListJsonConverter;
import csulzc.medical_big_data_cloud.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "assessment_report", indexes = {
        @Index(name = "idx_report_elderly", columnList = "elderly_id"),
        @Index(name = "idx_report_assessed", columnList = "assessed_at"),
        @Index(name = "idx_report_status", columnList = "review_status")
})
@SQLDelete(sql = "UPDATE assessment_report SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class AssessmentReport extends BaseEntity {

    @Column(nullable = false, length = 64)
    private String elderlyId;

    @Column(nullable = false, length = 50)
    private String reportType;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false, length = 10)
    private String grade;

    @Column(nullable = false, length = 2000)
    private String summary;

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "text")
    private List<String> riskItems = new ArrayList<>();

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "text")
    private List<String> recommendations = new ArrayList<>();

    @Column(length = 64)
    private String assessorId;

    @Column(nullable = false)
    private LocalDateTime assessedAt;

    @Column(nullable = false, length = 20)
    private String reviewStatus = "draft";

    @Column(length = 64)
    private String reviewerId;

    private LocalDateTime reviewedAt;
}
