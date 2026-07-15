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
@Table(name = "key_population", indexes = {
        @Index(name = "idx_key_population_elderly", columnList = "elderly_id"),
        @Index(name = "idx_key_population_owner", columnList = "owner_doctor_id"),
        @Index(name = "idx_key_population_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE key_population SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class KeyPopulation extends BaseEntity {

    @Column(nullable = false, length = 64)
    private String elderlyId;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(length = 500)
    private String reason;

    @Column(nullable = false, length = 10)
    private String level;

    @Column(length = 64)
    private String ownerDoctorId;

    @Column(nullable = false)
    private Integer followUpCycleDays;

    @Column(nullable = false, length = 20)
    private String status = "active";
}
