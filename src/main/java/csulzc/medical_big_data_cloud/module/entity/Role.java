package csulzc.medical_big_data_cloud.module.entity;

import csulzc.medical_big_data_cloud.common.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "sys_role")
@SQLDelete(sql = "UPDATE sys_role SET deleted = true, deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted = false")
public class Role extends BaseEntity {

    @Column(nullable = false, unique = true, length = 50)
    private String roleCode;

    @Column(nullable = false, length = 50)
    private String roleName;

    @Column(length = 200)
    private String description;

    @Column(nullable = false, length = 20)
    private String status = "enabled";
}
