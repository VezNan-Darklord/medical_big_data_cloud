// AssessmentReport.java
// 路径: src/main/java/csulzc/medical_big_data_cloud/module/report/entity/AssessmentReport.java
package csulzc.medical_big_data_cloud.module.entity;

import csulzc.medical_big_data_cloud.common.converter.StringListJsonConverter;
import csulzc.medical_big_data_cloud.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "assessment_report")
public class AssessmentReport extends BaseEntity {

    @Column(nullable = false, length = 64)
    private String elderlyId;

    @Column(nullable = false, length = 50)
    private String reportType;

    private Integer score;

    @Column(length = 10)
    private String grade;

    @Column(length = 2000)
    private String summary;

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "text")
    private List<String> riskItems;

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "text")
    private List<String> recommendations;

    @Column(length = 64)
    private String assessorId;

    private LocalDateTime assessedAt;
}
