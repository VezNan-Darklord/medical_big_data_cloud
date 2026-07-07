package csulzc.medical_big_data_cloud.module.population.entity;

import csulzc.medical_big_data_cloud.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "key_population")
public class KeyPopulation extends BaseEntity {

    @Column(nullable = false, length = 64)
    private String elderlyId;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(length = 500)
    private String reason;

    @Column(length = 10)
    private String level;

    @Column(length = 64)
    private String ownerDoctorId;

    private Integer followUpCycleDays;

    @Column(length = 20)
    private String status;
}
