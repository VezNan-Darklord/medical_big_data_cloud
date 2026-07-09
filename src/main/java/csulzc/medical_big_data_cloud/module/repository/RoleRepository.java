package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, String> {

    Optional<Role> findByRoleCode(String roleCode);

    Optional<Role> findByRoleCodeAndStatus(String roleCode, String status);

    boolean existsByRoleCode(String roleCode);
}
