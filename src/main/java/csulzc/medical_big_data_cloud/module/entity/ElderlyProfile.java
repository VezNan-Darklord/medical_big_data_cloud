package csulzc.medical_big_data_cloud.module.entity;

import csulzc.medical_big_data_cloud.common.converter.StringListJsonConverter;
import csulzc.medical_big_data_cloud.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "elderly_profile")
public class ElderlyProfile extends BaseEntity {
    @Column(nullable = false, length = 64)
    private String elderlyId;

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

    @Column(length = 1000)
    private String medicalHistory;

    @Column(length = 10)
    private String careLevel;

    @Convert(converter = StringListJsonConverter.class)
    @Column(columnDefinition = "text")
    private List<String> tags;

    @Column(length = 20)
    private String status;
}
