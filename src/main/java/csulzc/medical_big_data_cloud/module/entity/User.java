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

import java.time.LocalDateTime;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "sys_user", indexes = {
        @Index(name = "idx_user_username", columnList = "username", unique = true),
        @Index(name = "idx_user_mobile", columnList = "mobile", unique = true),
        @Index(name = "idx_user_role", columnList = "role_code"),
        @Index(name = "idx_user_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE sys_user SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class User extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String passwordHash;

    @Column(nullable = false, length = 50)
    private String realName;

    @Column(nullable = false, length = 20)
    private String roleCode;

    @Column(unique = true, length = 20)
    private String mobile;

    @Column(length = 64)
    private String institutionId;

    @Column(length = 64)
    private String regionCode;

    @Column(nullable = false, length = 20)
    private String status = "enabled";

    @Column(nullable = false)
    private Integer tokenVersion = 0;

    private LocalDateTime lastLoginAt;
}
