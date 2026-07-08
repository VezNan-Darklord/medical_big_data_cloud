// UserRepository.java
// 路径: src/main/java/csulzc/medical_big_data_cloud/module/account/repository/UserRepository.java
package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndStatus(String username, String status);

    List<User> findByRoleCode(String roleCode);

    List<User> findByStatus(String status);

    List<User> findByMobile(String mobile);

    Page<User> findByRoleCodeOrderByCreatedAtDesc(String roleCode, Pageable pageable);

    Page<User> findByStatusOrderByLastLoginAtDesc(String status, Pageable pageable);

    boolean existsByUsername(String username);

    long countByStatus(String status);

    long countByRoleCode(String roleCode);
}
