package csulzc.medical_big_data_cloud.module.entity;

import csulzc.medical_big_data_cloud.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "ai_analysis", indexes = {
        @Index(name = "idx_ai_analysis_scene", columnList = "scene"),
        @Index(name = "idx_ai_analysis_creator", columnList = "created_by")
})
@SQLDelete(sql = "UPDATE ai_analysis SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class AIAnalysis extends BaseEntity {
    @Column(nullable = false, length = 50)
    private String scene;

    @Column(length = 64)
    private String tenantId;

    @Column(length = 64)
    private String regionCode;

    @Column(nullable = false, length = 2000)
    private String summary;

    @Column(nullable = false, columnDefinition = "text")
    private String insightsJson;

    @Column(nullable = false, columnDefinition = "text")
    private String actionsJson;

    @Column(nullable = false, columnDefinition = "text")
    private String chartsJson;

    @Column(length = 64)
    private String createdBy;
}
