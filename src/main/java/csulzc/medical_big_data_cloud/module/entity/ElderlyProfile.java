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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "elderly_profile", indexes = {
        @Index(name = "idx_elderly_name", columnList = "name"),
        @Index(name = "idx_elderly_institution", columnList = "institution_id"),
        @Index(name = "idx_elderly_region", columnList = "region_code"),
        @Index(name = "idx_elderly_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE elderly_profile SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class ElderlyProfile extends BaseEntity {
    @Column(unique = true, length = 64)
    private String userId;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 10)
    private String gender;

    private LocalDate birthday;

    private Integer age;

    @Column(length = 20)
    private String phone;

    @Column(length = 500)
    private String address;

    @Column(length = 64)
    private String institutionId;

    @Column(length = 64)
    private String regionCode;

    @Column(length = 1000)
    private String medicalHistory;

    @Column(length = 10)
    private String careLevel;

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "text")
    private List<String> tags = new ArrayList<>();

    @Column(nullable = false, length = 20)
    private String status = "active";
}
