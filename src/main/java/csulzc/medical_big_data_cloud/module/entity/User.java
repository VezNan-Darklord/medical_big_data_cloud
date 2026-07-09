package csulzc.medical_big_data_cloud.module.entity;

import csulzc.medical_big_data_cloud.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "sys_user")
public class User extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Transient
    private String plainPassword;

    @Column(nullable = false, length = 100)
    private String passwordHash;

    @Column(length = 50)
    private String realName;

    @Column(length = 20)
    private String roleCode;

    @Column(length = 20)
    private String mobile;

    @Column(length = 20)
    private String status;

    private LocalDateTime lastLoginAt;
}
