package csulzc.medical_big_data_cloud.module.repository;

import csulzc.medical_big_data_cloud.module.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {

    // ================== 基础查询（按唯一/索引字段） ==================

    Optional<User> findByUsername(String username);

    Optional<User> findByUsernameAndStatus(String username, String status);

    Optional<User> findByMobile(String mobile);

    boolean existsByMobile(String mobile);

    boolean existsByUsername(String username);

    // ================== 按角色/状态统计与分页 ==================

    Page<User> findByRoleCode(String roleCode, Pageable pageable);

    Page<User> findByStatus(String status, Pageable pageable);

    long countByStatus(String status);

    long countByRoleCode(String roleCode);

    // ================== 登录相关更新（由 Service 调用） ==================

    /**
     * 更新最后登录时间
     */
    @Modifying
    @Query("UPDATE User u SET u.lastLoginAt = ?2 WHERE u.id = ?1")
    void updateLastLoginAt(String userId, LocalDateTime lastLoginAt);

    // ================== 批量/动态查询入口 ==================

    /**
     * JpaSpecificationExecutor 已提供：
     * Page<User> findAll(Specification<User> spec, Pageable pageable);
     * 用于支持：keyword + roleCode + status + mobile 组合条件查询
     */
}
